import express from "express";
import Campground from "../models/campground.js";
import catchAsync from "../utils/catchAsync.js";
import {reviewSchema} from "../validation/schema.js";
import Review from "../models/reviews.js";
import ExpressError from "../utils/ExpressError.js";



const router = express.Router({mergeParams : true});

const validateReview = (req, res, next) => {
    const {error} = reviewSchema.validate(req.body);
    if(error) {
        const msg = error.details.map(e => e.message).join(",")
        throw new ExpressError(msg, 400);
    }
    next();
}


router.post('/', validateReview, async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    res.redirect(`/campgrounds/${req.params.id}`)
})

router.delete("/:reviewId", catchAsync(async (req,res) => {
    const {id, reviewId} = req.params
    await Review.findByIdAndDelete(reviewId);
    await Campground.findByIdAndUpdate(id, {$pull : {reviews : reviewId}});
    res.redirect(`/campgrounds/${req.params.id}`);
}))


export default router;