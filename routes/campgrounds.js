import express from "express";
import Campground from "../models/campground.js";
import catchAsync from "../utils/catchAsync.js";
import { isloggedIn, validateCampground, isAuthor } from "../utils/middleware.js";
import * as campgrounds from "../controllers/campgrounds.js";
    
const router = express.Router();

router.get("/", catchAsync(campgrounds.index));

router.get("/new",isloggedIn, campgrounds.getNew)

router.get("/:id", catchAsync(campgrounds.show))

router.post("/",isloggedIn, validateCampground, catchAsync(campgrounds.createNew))

router.get("/:id/edit",isloggedIn, isAuthor, catchAsync(campgrounds.getEdit))

router.put("/:id",isloggedIn, isAuthor, validateCampground, catchAsync(campgrounds.edit))

router.delete("/:id",isloggedIn, isAuthor, catchAsync(campgrounds.deleteCampground))

export default router;