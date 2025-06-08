import express from "express";
import catchAsync from "../utils/catchAsync.js";
import passport from "passport";
import { storeReturnTo } from "../utils/middleware.js";
import * as users from "../controllers/users.js";
const router = express.Router();

router.get('/register', users.getRegister); 

router.post('/register', catchAsync(users.register));

router.get('/login', users.getLogin);

router.post('/login', storeReturnTo, passport.authenticate('local',{failureFlash:true, failureRedirect:'/login'}), users.login);

router.get('/logout', users.logout);

export default router;