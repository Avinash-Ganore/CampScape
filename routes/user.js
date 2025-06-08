import express from "express";
import catchAsync from "../utils/catchAsync.js";
import passport from "passport";
import { storeReturnTo } from "../utils/middleware.js";
import * as users from "../controllers/users.js";
const router = express.Router();

router.route('/register')
    .get(users.getRegister)
    .post(catchAsync(users.register));

router.route('/login')
    .get(users.getLogin)
    .post(storeReturnTo, passport.authenticate('local',{failureFlash:true, failureRedirect:'/login'}), users.login);

router.get('/logout', users.logout);

export default router;