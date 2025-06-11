const Review = require("../models/reviews");
const Campground = require("../models/campground");
module.exports.createReview = async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('success', 'Successfully made a new review!')
    res.redirect(`/campgrounds/${req.params.id}`)
}

module.exports.deleteReview = async (req,res) => {
    const {id, reviewId} = req.params
    await Review.findByIdAndDelete(reviewId);
    await Campground.findByIdAndUpdate(id, {$pull : {reviews : reviewId}});
    req.flash('error', 'Successfully deleted review!')
    res.redirect(`/campgrounds/${req.params.id}`);
}