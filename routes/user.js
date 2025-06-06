import express from "express";
import User from "../models/user.js";
import catchAsync from "../utils/catchAsync.js";
import passport from "passport";

const router = express.Router();

router.get('/register', (req, res) => {
    res.render('users/register');
});

router.post('/register', catchAsync(async (req, res) => {
    try {
        const {email, username, password} = req.body;
        const user = await new User({username, email});
        const registeredUser = await User.register(user, password);
        console.log(registeredUser);
        req.flash('success', 'Successfully registered!');
        res.redirect('/campgrounds');
    }
    catch(e) {
        req.flash('error', e.message);
        res.redirect('/register');
    }
}));

router.get('/login', (req, res) => {
    res.render('users/login');
});

router.post('/login',passport.authenticate('local',{failureFlash:true, failureRedirect:'/login'}), (req, res) => {
    req.flash('success', 'Welcome back!');
    res.redirect('/campgrounds');
});

export default router;