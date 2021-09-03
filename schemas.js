const Joi = require("joi");

// Joi validations
module.exports.campgroundsSchema = Joi.object({
  title: Joi.string().required(),
  location: Joi.string().required(),
  image: Joi.string().required(),
  price: Joi.number().min(0).required(),
  description: Joi.string().required(),
});
