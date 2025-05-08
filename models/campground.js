import mongoose from "mongoose";
const Schema = mongoose.Schema

const campgroundSchema = new Schema({
    title : String,
    price : Number,
    image : String,
    description : String,
    state : String,
    city: String
})

campgroundSchema.virtual('location').get( function () {
     return `${this.city}, ${this.state}`
    }
)

const Campground = mongoose.model("Campground", campgroundSchema);

export default Campground;