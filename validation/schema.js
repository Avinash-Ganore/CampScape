const joi = require('joi');

const campgroundSchema = joi.object({
    campground: joi.object({
        title: joi.string().required(),
        price: joi.number().required().min(0),
        image: joi.string().required(),
        description: joi.string().required(),
        city: joi.string().required(),
        state: joi.string().required()
    }).required()
});

const reviewSchema = joi.object({
    review: joi.object({
        body: joi.string().required(),
        rating: joi.number().max(5).min(1).required()
    }).required()
});

module.exports = {
    campgroundSchema,
    reviewSchema
};
