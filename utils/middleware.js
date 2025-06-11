const Campground = require("../models/campground");
const ExpressError = require("../utils/ExpressError");
const { campgroundSchema, reviewSchema } = require("../validation/schema");
const Review = require("../models/reviews");

module.exports.isloggedIn = (req, res, next) => {
    if(!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'You must be signed in');
        return res.redirect('/login');
    }
    next();
}
module.exports.storeReturnTo = (req, res, next) => {
    if (req.session.returnTo) {
    res.locals.returnTo = req.session.returnTo;
    }
    next();
}

module.exports.isAuthor = async (req, res, next) => {
    const {id} = req.params;
    const campground = await Campground.findById(id);
    if (!req.user._id.equals(campground.author)) {
        req.flash('error','You cannot edit the post!');
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}

module.exports.isReviewAuthor = async (req, res, next) => {
    const {id, reviewId} = req.params
    const review = await Review.findById(reviewId);
    if (!req.user._id.equals(review.author)) {
        req.flash('error','You cannot delete the review!');
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}

module.exports.validateCampground = (req, res, next) => {
    const {error} = campgroundSchema.validate(req.body);
    if(error) {
        const msg = error.details.map(e => e.message).join(",")
        throw new ExpressError(msg, 400);
    }
    next();
}


module.exports.validateReview = (req, res, next) => {
    const {error} = reviewSchema.validate(req.body);
    if(error) {
        const msg = error.details.map(e => e.message).join(",")
        throw new ExpressError(msg, 400);
    }
    next();
}