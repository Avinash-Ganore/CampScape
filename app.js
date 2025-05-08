import express from "express";
import mongoose from "mongoose";
import methodOverride from "method-override";
import path from "path";
import ejsMate from "ejs-mate";
import Campground from "./models/campground.js";

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

app.get("/campgrounds", async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index", {campgrounds});
})

app.get("/campgrounds/new", (req, res) => {
    res.render("campgrounds/create");
})

app.get("/campgrounds/:id", async (req, res) => {
    const campground= await Campground.findById(req.params.id);
    res.render("campgrounds/show",{campground})
})

const capitalize = e => e.charAt(0).toUpperCase() + e.slice(1);

app.post("/campgrounds", async (req, res) => {
    req.body.campground.title = capitalize(req.body.campground.title);
    req.body.campground.city = capitalize(req.body.campground.city);
    req.body.campground.state = capitalize(req.body.campground.state);
    const newCamp = new Campground(req.body.campground);
    await newCamp.save();
    res.redirect(`/campgrounds/${newCamp._id}`);
})

app.get("/campgrounds/:id/edit", async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    res.render("campgrounds/edit", {campground});
})

app.put("/campgrounds/:id", async (req, res) => {
    const {id} = req.params
    req.body.campground.title = capitalize(req.body.campground.title);
    req.body.campground.city = capitalize(req.body.campground.city);
    req.body.campground.state = capitalize(req.body.campground.state);
    await Campground.findByIdAndUpdate(id, req.body.campground, {runValidators: true})
    res.redirect(`/campgrounds/${id}`);
})

app.delete("/campgrounds/:id", async (req, res) => {
    await Campground.findByIdAndDelete(req.params.id);
    res.redirect("/campgrounds");
})

app.listen(port, () => {
    console.log(`Serving on http://localhost:${port}`);
})