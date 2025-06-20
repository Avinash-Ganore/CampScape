const express = require("express");
const Campground = require("../models/campground");
const catchAsync = require("../utils/catchAsync");
const { isloggedIn, validateCampground, isAuthor } = require("../utils/middleware");
const campgrounds = require("../controllers/campgrounds");
const multer = require("multer");
const {storage} = require('../cloudinary');
const upload = multer({ storage }); 

    
const router = express.Router();

router.route('/')
    .get(catchAsync(campgrounds.index))
    .post(isloggedIn, upload.array('image'), validateCampground,catchAsync(campgrounds.createNew));


router.get("/new",isloggedIn, campgrounds.getNew)

router.route("/:id")
    .get(catchAsync(campgrounds.show))
    .put(isloggedIn, isAuthor, upload.array('image'), validateCampground, catchAsync(campgrounds.edit))
    .delete(isloggedIn, isAuthor, catchAsync(campgrounds.deleteCampground));

router.get("/:id/edit",isloggedIn, isAuthor, catchAsync(campgrounds.getEdit));

module.exports = router;
