import mongoose from "mongoose";
const {Schema} = mongoose;

const reviewSchema = new Schema({
    body : String,
    rating : Number
})


export default mongoose.model("Review", reviewSchema);