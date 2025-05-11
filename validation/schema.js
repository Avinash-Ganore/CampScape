import joi from 'joi';

const campgroundSchema = joi.object({
    campground : joi.object({
        title : joi.string().required(),
        price : joi.number().required().min(0),
        image : joi.string().required(),
        description : joi.string().required(),
        city : joi.string().required(),
        state : joi.string().required()
    }).required()
})

export default campgroundSchema;