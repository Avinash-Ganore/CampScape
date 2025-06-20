const Campground = require('../models/campground');
const capitalize = require('../utils/capitalize');
const {cloudinary} = require('../cloudinary');
const maptilerClient = require("@maptiler/client");
maptilerClient.config.apiKey = process.env.MAPTILER_API_KEY;


module.exports.index = async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index", {campgrounds});
}

module.exports.getNew = (req, res) => {
    res.render("campgrounds/create");
}

module.exports.show = async (req, res) => {
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

module.exports.createNew = async (req, res) => {
    req.body.campground.title = capitalize(req.body.campground.title);
    req.body.campground.city = capitalize(req.body.campground.city);
    req.body.campground.state = capitalize(req.body.campground.state);
    const newCamp = new Campground(req.body.campground);
    const geoData = await maptilerClient.geocoding.forward(newCamp.location, { limit: 1 });
    newCamp.geometry = geoData.features[0].geometry;
    newCamp.image = req.files.map(file => ({url : file.path, filename : file.filename}));
    newCamp.author = req.user._id;
    await newCamp.save();
    req.flash('success', 'Successfully made a new campground!')
    res.redirect(`/campgrounds/${newCamp._id}`);
}

    module.exports.getEdit = async (req, res) => {
    const {id} = req.params;
    const campground = await Campground.findById(id);
    if (!campground) {
        req.flash('error', 'Cannot find that campground!');
        return res.redirect("/campgrounds");
    }
    res.render("campgrounds/edit", {campground});
}

module.exports.edit = async (req, res) => {
    const {id} = req.params;
    req.body.campground.title = capitalize(req.body.campground.title);
    req.body.campground.city = capitalize(req.body.campground.city);
    req.body.campground.state = capitalize(req.body.campground.state);
    const campground = await Campground.findByIdAndUpdate(id, req.body.campground, {runValidators: true, new: true});
    const geoData = await maptilerClient.geocoding.forward(campground.location, { limit: 1 });
    campground.geometry = geoData.features[0].geometry;
    const images = req.files.map(file => ({url : file.path, filename : file.filename}));
    campground.image.push(...images);
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await campground.updateOne({$pull : {image : {filename : {$in : req.body.deleteImages}}}})
    }
    await campground.save();
    req.flash('success', 'Successfully updated campground!')
    res.redirect(`/campgrounds/${id}`);
}

module.exports.deleteCampground = async (req, res) => {
    await Campground.findByIdAndDelete(req.params.id);
    req.flash('success', 'Successfully deleted campground!')
    res.redirect("/campgrounds");
}



