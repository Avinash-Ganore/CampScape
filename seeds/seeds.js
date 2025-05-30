
import mongoose from "mongoose";
import campground from "../models/campground.js";
import cities from "./cities.js";
import {descriptors, places} from "./title.js";


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

const random = array => array[Math.floor(Math.random() * array.length)]

const seeddb = async () => {
    await campground.deleteMany({});
    for (let i=0; i<50; i++) {
        const camp = new campground({
            title : `${random(descriptors)} ${random(places)}`,
            city : random(cities).city,
            state : random(cities).state,
            image : `https://picsum.photos/400?random=${Math.random()}`,
            description : "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod.",
            price : Math.floor(Math.random() * 20) + 10
        });
        await camp.save();
    }
}

seeddb().then(() => mongoose.connection.close());
