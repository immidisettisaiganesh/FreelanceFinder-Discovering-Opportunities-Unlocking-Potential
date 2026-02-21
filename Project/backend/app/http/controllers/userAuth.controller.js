require('dotenv').config();
const createError = require("http-errors");
const { UserModel } = require("../../models/user");
const { generateRandomNumber, setAccessToken, setRefreshToken, verifyRefreshToken } = require("../../../utils/functions");
const { StatusCodes: HttpStatus } = require("http-status-codes");
const { completeProfileSchema, updateProfileSchema, checkOtpSchema } = require("../validators/user.schema");

const CODE_EXPIRES = 90 * 1000; // 90 seconds

async function getOtp(req, res) {
  let { phoneNumber } = req.body;
  if (!phoneNumber) throw createError.BadRequest("Enter a valid phone number.");
  phoneNumber = phoneNumber.trim();
  const code = generateRandomNumber(6);

  const result = await saveUser(phoneNumber, code);
  if (!result) throw createError.Unauthorized("Login failed.");

  await sendOTP(phoneNumber, code, res);
}

async function checkOtp(req, res) {
  await checkOtpSchema.validateAsync(req.body);
  const { otp: code, phoneNumber } = req.body;

  const user = await UserModel.findOne(
    { phoneNumber },
    { password: 0, refreshToken: 0, accessToken: 0 }
  );

  if (!user) throw createError.NotFound("User with these credentials not found.");
  if (user.otp.code != code) throw createError.BadRequest("The sent code is not valid.");
  if (new Date(`${user.otp.expiresIn}`).getTime() < Date.now())
    throw createError.BadRequest("The verification code has expired.");

  user.isVerifiedPhoneNumber = true;
  await user.save();

  await setAccessToken(res, user);
  await setRefreshToken(res, user);

  const WELCOME_MESSAGE = user.isActive
    ? "Code confirmed, welcome to SB Works!"
    : "Confirmed. Please fill in your details.";

  return res.status(HttpStatus.OK).json({
    statusCode: HttpStatus.OK,
    data: { message: WELCOME_MESSAGE, user },
  });
}

async function saveUser(phoneNumber, code) {
  const otp = { code, expiresIn: Date.now() + CODE_EXPIRES };
  const user = await UserModel.findOne({ phoneNumber });
  if (user) {
    await UserModel.updateOne({ phoneNumber }, { $set: { otp } });
    return true;
  }
  const newUser = await UserModel.create({ phoneNumber, otp });
  return !!newUser?._id;
}

const sendOTP = async (phoneNumber, code, res) => {
  console.log("\n========================================");
  console.log(`📱 OTP for ${phoneNumber} : ${code}`);
  console.log("========================================\n");

  const USE_TWILIO = !!(process.env.TWILIO_ACCOUNT_SID &&
    process.env.TWILIO_AUTH_TOKEN &&
    process.env.TWILIO_PHONE_NUMBER &&
    process.env.TWILIO_ACCOUNT_SID !== "your_twilio_sid");

  if (USE_TWILIO) {
    try {
      const twilio = require('twilio');
      const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
      await client.messages.create({
        body: `Your SB Works code: ${code}`,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: phoneNumber,
      });
      console.log("✅ SMS sent via Twilio");
    } catch (err) {
      console.error("⚠️  Twilio failed:", err.message);
    }
  }

  return res.status(HttpStatus.OK).send({
    statusCode: HttpStatus.OK,
    data: {
      message: USE_TWILIO
        ? `Verification code sent to ${phoneNumber}`
        : `[DEV] OTP printed in backend terminal`,
      expiresIn: CODE_EXPIRES,
      phoneNumber,
    },
  });
};

const completeProfile = async (req, res) => {
  await completeProfileSchema.validateAsync(req.body);
  const { user } = req;
  const { name, email, role } = req.body;

  if (!user.isVerifiedPhoneNumber) throw createError.Forbidden("Verify your mobile number first.");

  const duplicate = await UserModel.findOne({ email, _id: { $ne: user._id } });
  if (duplicate) throw createError.BadRequest("A user with this email is already registered.");

  const updatedUser = await UserModel.findOneAndUpdate(
    { _id: user._id },
    { $set: { name, email, isActive: true, role } },
    { new: true }
  );

  await setAccessToken(res, updatedUser);
  await setRefreshToken(res, updatedUser);

  return res.status(HttpStatus.OK).send({
    statusCode: HttpStatus.OK,
    data: { message: "Profile completed successfully.", user: updatedUser },
  });
};

const updateProfile = async (req, res) => {
  const { _id: userId } = req.user;
  await updateProfileSchema.validateAsync(req.body);
  const { name, email, biography, phoneNumber } = req.body;

  await UserModel.updateOne({ _id: userId }, { $set: { name, email, biography, phoneNumber } });
  return res.status(HttpStatus.OK).json({
    statusCode: HttpStatus.OK,
    data: { message: "Profile updated successfully." },
  });
};

const refreshToken = async (req, res) => {
  const userId = await verifyRefreshToken(req);
  const user = await UserModel.findById(userId);
  await setAccessToken(res, user);
  await setRefreshToken(res, user);
  return res.status(HttpStatus.OK).json({ StatusCode: HttpStatus.OK, data: { user } });
};

const getUserProfile = async (req, res) => {
  const user = await UserModel.findById(req.user._id, { otp: 0 });
  return res.status(HttpStatus.OK).json({ statusCode: HttpStatus.OK, data: { user } });
};

const logout = (req, res) => {
  const opts = {
    maxAge: 1, httpOnly: true, signed: true, sameSite: "Lax",
    secure: false, path: "/", domain: "localhost",
  };
  res.cookie("accessToken", null, opts);
  res.cookie("refreshToken", null, opts);
  return res.status(HttpStatus.OK).json({ StatusCode: HttpStatus.OK, auth: false });
};

module.exports = { getOtp, checkOtp, completeProfile, updateProfile, refreshToken, getUserProfile, logout };
