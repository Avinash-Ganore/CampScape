if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}

const sanitizeV5 = require('./utils/mongoSanitizeV5.js');
const express = require("express");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const path = require("path");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError");
const session = require("express-session");
const flash = require("connect-flash");
const campRoutes = require("./routes/campgrounds");
const reviewsRoutes = require("./routes/reviews");
const userRoutes = require("./routes/user");
const User = require("./models/user");
const passport = require("passport");
const local = require("passport-local");

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
app.set('query parser', 'extended');

const port = 3000;

app.engine("ejs", ejsMate);
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, "public")));
app.use(sanitizeV5({ replaceWith: '_' }));

const sessionConfig = {
    name: "session",
    secret: "thisshouldbeabettersecret!",
    resave: false,
    saveUninitialized: true,
    cookie: {   
        httpOnly: true,
        // secure: true,
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
    res.locals.currentUser = req.user;
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
})

app.use(methodOverride('_method'));
app.set("views", path.join(__dirname , "views"));
app.set("view engine", "ejs");


app.use('/', userRoutes)
app.use('/campgrounds', campRoutes);
app.use('/campgrounds/:id/reviews', reviewsRoutes);

app.get('/', (req, res) => {
    console.log(req.query);
    res.render('home');
})


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