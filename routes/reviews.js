const express = require("express");
const catchAsync = require("../utils/catchAsync");
const { isloggedIn, validateReview, isAuthor, isReviewAuthor } = require("../utils/middleware");
const reviews = require("../controllers/reviews");

const router = express.Router({mergeParams : true});

router.post('/', isloggedIn, validateReview, catchAsync(reviews.createReview));

router.delete("/:reviewId", isloggedIn, isReviewAuthor, catchAsync(reviews.deleteReview))


module.exports = router;