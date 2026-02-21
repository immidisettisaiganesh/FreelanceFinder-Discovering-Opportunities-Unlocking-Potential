const Joi = require("joi");
const createHttpError = require("http-errors");

const checkOtpSchema = Joi.object({
  otp: Joi.string()
    .min(4)
    .max(8)
    .error(createHttpError.BadRequest("The sent code is not valid.")),
  phoneNumber: Joi.string()
    .min(7)
    .max(20)
    .error(createHttpError.BadRequest("The entered phone number is not valid.")),
});

const completeProfileSchema = Joi.object({
  name: Joi.string()
    .min(5)
    .max(100)
    .error(createHttpError.BadRequest("The entered username is not valid.")),
  email: Joi.string()
    .email()
    .error(createHttpError.BadRequest("The entered email address is not valid.")),
  role: Joi.string()
    .required()
    .valid("FREELANCER", "OWNER")
    .error(createHttpError.BadRequest("The role is not valid.")),
});

const updateProfileSchema = Joi.object({
  name: Joi.string()
    .min(5)
    .max(50)
    .required()
    .error(createHttpError.BadRequest("The entered username is not valid.")),
  email: Joi.string()
    .required()
    .email()
    .error(createHttpError.BadRequest("The entered email address is not valid.")),
  phoneNumber: Joi.string()
    .min(7)
    .max(20)
    .allow("")
    .error(createHttpError.BadRequest("The entered mobile number is not valid.")),
  biography: Joi.string()
    .max(500)
    .allow("")
    .error(createHttpError.BadRequest("Biography field is not valid.")),
});

module.exports = {
  checkOtpSchema,
  completeProfileSchema,
  updateProfileSchema,
};
