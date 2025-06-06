import express from "express";
import mongoose from "mongoose";
import methodOverride from "method-override";
import path from "path";
import ejsMate from "ejs-mate";
import ExpressError from "./utils/ExpressError.js";
import session from "express-session";
import flash from "connect-flash";
import campRoutes from "./routes/campgrounds.js";
import reviewsRoutes from "./routes/reviews.js";
import userRoutes from "./routes/user.js";
import User from "./models/user.js";
import passport from "passport";
import local from "passport-local";

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
app.use(express.static(path.join(import.meta.dirname, "public")));

const sessionConfig = {
    secret: "thisshouldbeabettersecret!",
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
};

app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new local(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
})

app.use(methodOverride('_method'));
app.set("views", path.join(import.meta.dirname , "views"));
app.set("view engine", "ejs");


app.use('/', userRoutes)
app.use('/campgrounds', campRoutes);
app.use('/campgrounds/:id/reviews', reviewsRoutes);



app.all(/.*/, (req , res, next) => {
    next(new ExpressError("Page Not Found",404));
})

app.use((err, req, res, next) => {
    const {statusCode= 500} = err;
    if(!err.message) err.message ='Something went wrong!';
    res.status(statusCode).render('error', {err});
    
})


app.listen(port, () => {
    console.log(`Serving on http://localhost:${port}/campgrounds`);
})