import mongoose from "mongoose";
import Review from "./reviews.js";
const Schema = mongoose.Schema

const campgroundSchema = new Schema({
    title : String,
    price : Number,
    image : String,
    description : String,
    state : String,
    city: String,
    reviews: [
        {
            type : Schema.Types.ObjectID,
            ref : "Review"
        }
    ]
})

campgroundSchema.virtual('location').get( function () {
     return `${this.city}, ${this.state}`
    }
)

campgroundSchema.post('findOneAndDelete', async function(doc) {
   if(doc) {
    await Review.deleteMany({
        _id : {
            $in : doc.reviews
        }
    })
   }
})

const Campground = mongoose.model("Campground", campgroundSchema);

export default Campground;