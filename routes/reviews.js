import express from "express";
import catchAsync from "../utils/catchAsync.js";
import { isloggedIn, validateReview, isAuthor, isReviewAuthor } from "../utils/middleware.js";
import * as reviews from "../controllers/reviews.js"

const router = express.Router({mergeParams : true});

router.post('/', isloggedIn, validateReview, catchAsync(reviews.createReview));

router.delete("/:reviewId", isloggedIn, isReviewAuthor, catchAsync(reviews.deleteReview))


export default router;