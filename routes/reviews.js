import express from "express";
import Campground from "../models/campground.js";
import catchAsync from "../utils/catchAsync.js";
import Review from "../models/reviews.js";
import { isloggedIn, validateReview, isAuthor, isReviewAuthor } from "../utils/middleware.js";

const router = express.Router({mergeParams : true});

router.post('/', isloggedIn, validateReview, catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('success', 'Successfully made a new review!')
    res.redirect(`/campgrounds/${req.params.id}`)
}));

router.delete("/:reviewId", isloggedIn, isReviewAuthor, catchAsync(async (req,res) => {
    const {id, reviewId} = req.params
    await Review.findByIdAndDelete(reviewId);
    await Campground.findByIdAndUpdate(id, {$pull : {reviews : reviewId}});
    req.flash('error', 'Successfully deleted review!')
    res.redirect(`/campgrounds/${req.params.id}`);
}))


export default router;