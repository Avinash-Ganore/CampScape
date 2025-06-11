const express = require("express");
const catchAsync = require("../utils/catchAsync");
const passport = require("passport");
const { storeReturnTo } = require("../utils/middleware");
const users = require("../controllers/users");
const router = express.Router();

router.route('/register')
    .get(users.getRegister)
    .post(catchAsync(users.register));

router.route('/login')
    .get(users.getLogin)
    .post(storeReturnTo, passport.authenticate('local',{failureFlash:true, failureRedirect:'/login'}), users.login);

router.get('/logout', users.logout);

module.exports = router;
