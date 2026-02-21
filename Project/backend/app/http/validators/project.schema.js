const createError = require("http-errors");
const Joi = require("joi");
const { MongoIDPattern } = require("../../../utils/constants");

const addProjectSchema = Joi.object({
  title: Joi.string()
    .required()
    .min(10)
    .max(100)
    .error(createError.BadRequest("The product title is not valid.")),
  description: Joi.string()
    .required()
    .error(createError.BadRequest("The sent description is not valid.")),
  tags: Joi.array()
    .min(0)
    .max(20)
    .error(createError.BadRequest("Tags cannot be more than 20 items.")),
  category: Joi.string()
    .required()
    .regex(MongoIDPattern)
    .error(createError.BadRequest("The desired category is not valid.")),
  budget: Joi.number().error(
    createError.BadRequest("The entered price is not valid.")
  ),
  deadline: Joi.date()
    .required()
    .error(createError.BadRequest("Enter the project deadline.")),
});

module.exports = {
  addProjectSchema,
};
