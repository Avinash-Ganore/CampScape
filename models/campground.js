const mongoose = require("mongoose");
const Review = require("./reviews");
const { cloudinary } = require("../cloudinary");
const Schema = mongoose.Schema;

const imageSchema = new Schema({
    url : String,
    filename : String
});


const campgroundSchema = new Schema({
    title : String,
    price : Number,
    image : [imageSchema],
    geometry : {
        type : {
            type : String,
            enum : ['Point'],
            required : true
        },
        coordinates : {
            type : [Number],
            required : true
        }
    },
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
imageSchema.virtual('thumbnail').get(function() {
    return this.url.replace('/upload', '/upload/w_200');
});

campgroundSchema.virtual('location').get( function () {
     return (`${this.city}, ${this.state}`);
    }
);


campgroundSchema.post('findOneAndDelete', async function(doc) {
   if(doc) {
    await Review.deleteMany({
        _id : {
            $in : doc.reviews
        }
    })
   }

   if (doc.image) {
    for (let img of doc.image) {
      await cloudinary.uploader.destroy(img.filename);
    }
  }


})

const Campground = mongoose.model("Campground", campgroundSchema);

module.exports = Campground;