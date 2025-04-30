import express from "express";
import mongoose from "mongoose";
import methodOverride from "method-override";
import path from "path";
import campground from "./models/campground.js";

mongoose.connect("mongodb://localhost:27017/yelpCamp",{
        useNewUrlParser : true,
        useUnifiedTopology : true
})
.then(() => {
    console.log("Database connected!!");
})
.catch(err => {
    console.log("Error!!");
    console.log(err);
})

const app = express();
const port = 3000;

app.set("views", path.join(import.meta.dirname , "views"));
app.set("view engine", "ejs");

app.get("/", (req,res) => {})

app.get("/make", async (req, res) => {
    const camp = new campground({title : "Avinash",location : "India"})
    await camp.save();
    res.send(camp)
})

app.listen(3000, () => {
    console.log(`Serving on 3000`);
})