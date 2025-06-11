const mongoose = require("mongoose");
const Review = require("./reviews");
const Schema = mongoose.Schema

const campgroundSchema = new Schema({
    title : String,
    price : Number,
    image : [
        {
            url: String,
            filename : String
        }
    ],
    description : String,
    state : String,
    city: String,
    author: {
        type : Schema.Types.ObjectId,
        ref : 'User'
    },
    reviews: [
        {
            type : Schema.Types.ObjectId,
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

module.exports = Campground;