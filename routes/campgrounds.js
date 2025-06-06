import express from "express";
import {campgroundSchema} from "../validation/schema.js";
import Campground from "../models/campground.js";
import catchAsync from "../utils/catchAsync.js";
import ExpressError from "../utils/ExpressError.js";
import { isloggedIn } from "../utils/middleware.js";

const router = express.Router();

const validateCampground = (req, res, next) => {
    const {error} = campgroundSchema.validate(req.body);
    if(error) {
        const msg = error.details.map(e => e.message).join(",")
        throw new ExpressError(msg, 400);
    }
    next();
}

const validateReview = (req, res, next) => {
    const {error} = reviewSchema.validate(req.body);
    if(error) {
        const msg = error.details.map(e => e.message).join(",")
        throw new ExpressError(msg, 400);
    }
    next();
}

router.get("/", catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index", {campgrounds});
}))

router.get("/new",isloggedIn, (req, res) => {
    res.render("campgrounds/create");
})

router.get("/:id", catchAsync(async (req, res) => {
    const campground= await Campground.findById(req.params.id).populate("reviews");
    if(!campground) {
        req.flash('error', 'Cannot find that campground!');
        return res.redirect("/campgrounds");
    }
    res.render("campgrounds/show",{campground})
}))

const capitalize = e => e.charAt(0).toUpperCase() + e.slice(1);

router.post("/",isloggedIn, validateCampground, catchAsync(async (req, res) => {
    req.body.campground.title = capitalize(req.body.campground.title);
    req.body.campground.city = capitalize(req.body.campground.city);
    req.body.campground.state = capitalize(req.body.campground.state);
    const newCamp = new Campground(req.body.campground);
    await newCamp.save();
    req.flash('success', 'Successfully made a new campground!')
    res.redirect(`/campgrounds/${newCamp._id}`);
}))

router.get("/:id/edit",isloggedIn, catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    if(!campground) {
        req.flash('error', 'Cannot find that campground!');
        return res.redirect("/campgrounds");
    }
    res.render("campgrounds/edit", {campground});
}))


router.put("/:id",isloggedIn, validateCampground, catchAsync(async (req, res) => {
    const {id} = req.params
    req.body.campground.title = capitalize(req.body.campground.title);
    req.body.campground.city = capitalize(req.body.campground.city);
    req.body.campground.state = capitalize(req.body.campground.state);
    await Campground.findByIdAndUpdate(id, req.body.campground, {runValidators: true})
    req.flash('success', 'Successfully updated campground!')
    res.redirect(`/campgrounds/${id}`);
}))


router.delete("/:id",isloggedIn, catchAsync(async (req, res) => {
    await Campground.findByIdAndDelete(req.params.id);
    req.flash('success', 'Successfully deleted campground!')
    res.redirect("/campgrounds");
}))

export default router;