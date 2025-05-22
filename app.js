import express from "express";
import mongoose from "mongoose";
import methodOverride from "method-override";
import path from "path";
import ejsMate from "ejs-mate";
import {campgroundSchema, reviewSchema} from "./validation/schema.js";
import Campground from "./models/campground.js";
import Review from "./models/reviews.js";
import catchAsync from "./utils/catchAsync.js";
import ExpressError from "./utils/ExpressError.js";

mongoose.connect("mongodb://localhost:27017/yelpCamp",{
        useNewUrlParser : true,
        useUnifiedTopology : true
})
.then(() => console.log("Database connected!!"))
.catch(err => {
    console.log("Error!!");
    console.log(err);
})

const app = express();
const port = 3000;

app.engine("ejs", ejsMate);
app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));
app.set("views", path.join(import.meta.dirname , "views"));
app.set("view engine", "ejs");

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


app.get("/campgrounds", catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index", {campgrounds});
}))

app.get("/campgrounds/new", (req, res) => {
    res.render("campgrounds/create");
})

app.get("/campgrounds/:id", catchAsync(async (req, res) => {
    const campground= await Campground.findById(req.params.id).populate("reviews");
    res.render("campgrounds/show",{campground})
}))

const capitalize = e => e.charAt(0).toUpperCase() + e.slice(1);

app.post("/campgrounds", validateCampground, catchAsync(async (req, res) => {
    req.body.campground.title = capitalize(req.body.campground.title);
    req.body.campground.city = capitalize(req.body.campground.city);
    req.body.campground.state = capitalize(req.body.campground.state);
    const newCamp = new Campground(req.body.campground);
    await newCamp.save();
    res.redirect(`/campgrounds/${newCamp._id}`);
}))

app.get("/campgrounds/:id/edit", catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    res.render("campgrounds/edit", {campground});
}))

app.put("/campgrounds/:id", validateCampground, catchAsync(async (req, res) => {
    const {id} = req.params
    req.body.campground.title = capitalize(req.body.campground.title);
    req.body.campground.city = capitalize(req.body.campground.city);
    req.body.campground.state = capitalize(req.body.campground.state);
    await Campground.findByIdAndUpdate(id, req.body.campground, {runValidators: true})
    res.redirect(`/campgrounds/${id}`);
}))

app.delete("/campgrounds/:id", catchAsync(async (req, res) => {
    await Campground.findByIdAndDelete(req.params.id);
    res.redirect("/campgrounds");
}))


app.post('/campgrounds/:id/reviews', validateReview, async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    res.redirect(`/campgrounds/${req.params.id}`)
})

app.delete("/campgrounds/:id/reviews/:reviewId", catchAsync(async (req,res) => {
    const {id, reviewId} = req.params
    await Review.findByIdAndDelete(reviewId);
    await Campground.findByIdAndUpdate(id, {$pull : {reviews : reviewId}});
    res.redirect(`/campgrounds/${req.params.id}`);
}))

app.all(/.*/, (req , res, next) => {
    next(new ExpressError("Page Not Found",404));
})

app.use((err, req, res, next) => {
    const {statusCode= 500} = err;
    if(!err.message) err.message ='Something went wrong!';
    res.status(statusCode).render('error', {err});
    
})


app.listen(port, () => {
    console.log(`Serving on http://localhost:${port}`);
})