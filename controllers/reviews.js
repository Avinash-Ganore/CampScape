import Review from "../models/reviews.js";
import Campground from "../models/campground.js";
export const createReview = async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('success', 'Successfully made a new review!')
    res.redirect(`/campgrounds/${req.params.id}`)
}

export const deleteReview = async (req,res) => {
    const {id, reviewId} = req.params
    await Review.findByIdAndDelete(reviewId);
    await Campground.findByIdAndUpdate(id, {$pull : {reviews : reviewId}});
    req.flash('error', 'Successfully deleted review!')
    res.redirect(`/campgrounds/${req.params.id}`);
}