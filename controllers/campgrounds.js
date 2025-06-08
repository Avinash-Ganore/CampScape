import Campground from "../models/campground.js";
import capitalize from "../utils/capitalize.js";

export const index = async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index", {campgrounds});
}

export const getNew = (req, res) => {
    res.render("campgrounds/create");
}

export const show = async (req, res) => {
    const campground= await Campground.findById(req.params.id).populate({
        path: "reviews",
        populate : {
            path : 'author',
            select : 'username'
        }})
        .populate('author','username');

    if(!campground) {
        req.flash('error', 'Cannot find that campground!');
        return res.redirect("/campgrounds");
    }
    res.render("campgrounds/show",{campground})
}

export const createNew = async (req, res) => {
    req.body.campground.title = capitalize(req.body.campground.title);
    req.body.campground.city = capitalize(req.body.campground.city);
    req.body.campground.state = capitalize(req.body.campground.state);
    const newCamp = new Campground(req.body.campground);
    newCamp.author = req.user._id
    await newCamp.save();
    req.flash('success', 'Successfully made a new campground!')
    res.redirect(`/campgrounds/${newCamp._id}`);
}

    export const getEdit = async (req, res) => {
    const {id} = req.params;
    const campground = await Campground.findById(id);
    if (!campground) {
        req.flash('error', 'Cannot find that campground!');
        return res.redirect("/campgrounds");
    }
    res.render("campgrounds/edit", {campground});
}

export const edit = async (req, res) => {
    const {id} = req.params;
    req.body.campground.title = capitalize(req.body.campground.title);
    req.body.campground.city = capitalize(req.body.campground.city);
    req.body.campground.state = capitalize(req.body.campground.state);
    await Campground.findByIdAndUpdate(id, req.body.campground, {runValidators: true})
    req.flash('success', 'Successfully updated campground!')
    res.redirect(`/campgrounds/${id}`);
}

export const deleteCampground = async (req, res) => {
    await Campground.findByIdAndDelete(req.params.id);
    req.flash('success', 'Successfully deleted campground!')
    res.redirect("/campgrounds");
}



