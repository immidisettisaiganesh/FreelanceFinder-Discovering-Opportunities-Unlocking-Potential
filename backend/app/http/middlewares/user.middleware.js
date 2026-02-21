const cookieParser = require("cookie-parser");
const createHttpError = require("http-errors");
const JWT = require("jsonwebtoken");
const { UserModel } = require("../../models/user");

async function verifyAccessToken(req, res, next) {
  try {
    const accessToken = req.signedCookies["accessToken"];
    if (!accessToken) {
      throw createHttpError.Unauthorized("Please log in to your account.");
    }
    const token = cookieParser.signedCookie(
      accessToken,
      process.env.COOKIE_PARSER_SECRET_KEY
    );
    JWT.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET_KEY,
      async (err, payload) => {
        try {
          if (err) throw createHttpError.Unauthorized("Invalid or expired token.");
          const { _id } = payload;
          const user = await UserModel.findById(_id, { password: 0, otp: 0 });
          if (!user) throw createHttpError.Unauthorized("Account not found.");
          req.user = user;
          return next();
        } catch (error) {
          next(error);
        }
      }
    );
  } catch (error) {
    next(error);
  }
}

async function isVerifiedUser(req, res, next) {
  try {
    const user = req.user;
    // Admin users always pass through
    if (user.role === "ADMIN") return next();
    if (user.status === 0) {
      throw createHttpError.Forbidden("Your account has been rejected. Contact support.");
    }
    // Allow both pending (1) and approved (2) - admin approves users
    // If you want to require admin approval, change this to: if (user.status !== 2)
    if (!user.isActive) {
      throw createHttpError.Forbidden("Please complete your profile first.");
    }
    return next();
  } catch (error) {
    next(error);
  }
}

module.exports = { verifyAccessToken, isVerifiedUser };
