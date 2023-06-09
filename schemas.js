const BaseJoi = require("joi");
const { sanitizeFilter } = require("mongoose");
const sanitizeHtml = require('sanitize-html');

const extension = (joi) => ({
  type: 'string',
  base: joi.string(),
  messages: {
    'string.escapeHTML': '{{#label}} must not include HTML!'
  },
  rules: {
    escapeHTML: {
      validate(value, helpers) {
        const clean = sanitizeHtml(value, {
          allowedTags: [],
          allowedAttributes: {},
        });
        if (clean !== value) return helpers.error('string.escapeHTML', { value })
        return clean;
      }
    }
  }  
});

const Joi = BaseJoi.extend(extension)

module.exports.bugSchema = Joi.object({
  bug: Joi.object({
    name: Joi.string().required().escapeHTML(),
    location: Joi.string().required().escapeHTML(),
    sciName: Joi.string().allow("").optional().escapeHTML(),
    description: Joi.string().required().escapeHTML(),
    // image: Joi.string().required()
  }).required(),
  deleteImages: Joi.array(),
});

module.exports.reviewSchema = Joi.object({
  review: Joi.object({
    rating: Joi.number().required().min(1).max(5),
    body: Joi.string().required().escapeHTML(),
  }).required(),
});
