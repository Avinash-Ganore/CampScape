import express from "express";
import Campground from "../models/campground.js";
import catchAsync from "../utils/catchAsync.js";
import { isloggedIn, validateCampground, isAuthor } from "../utils/middleware.js";
import * as campgrounds from "../controllers/campgrounds.js";
    
const router = express.Router();

router.route('/')
    .get(catchAsync(campgrounds.index))
    .post(isloggedIn, validateCampground, catchAsync(campgrounds.createNew));

router.get("/new",isloggedIn, campgrounds.getNew)

router.route("/:id")
    .get(catchAsync(campgrounds.show))
    .put(isloggedIn, isAuthor, validateCampground, catchAsync(campgrounds.edit))
    .delete(isloggedIn, isAuthor, catchAsync(campgrounds.deleteCampground));

router.get("/:id/edit",isloggedIn, isAuthor, catchAsync(campgrounds.getEdit));

export default router;