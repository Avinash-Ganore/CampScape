const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./title');
const campground = require('../models/campground');


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

/**
 * The function `seeddb` populates a database with 50 campground entries using random descriptors,
 * places, cities, and images.
 */
const seeddb = async () => {
    await campground.deleteMany({});
    for (let i=0; i<50; i++) {
        const camp = new campground({
            title : `${random(descriptors)} ${random(places)}`,
            city : random(cities).city,
            state : random(cities).state,
            author : '6841eb7470c336959b27028e',
            image : [
    {
      url: 'https://res.cloudinary.com/drtjoxefc/image/upload/v1749649445/CampScape/paojbtm3imok81m7pots.jpg',
      filename: 'CampScape/paojbtm3imok81m7pots'
    },
    {
      url: 'https://res.cloudinary.com/drtjoxefc/image/upload/v1749649445/CampScape/ohnhfbyk1v0n8zoozir1.png',
      filename: 'CampScape/ohnhfbyk1v0n8zoozir1'
    }
  ],
            description : "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod.",
            price : Math.floor(Math.random() * 20) + 10,
            geometry : {
                type : "Point",
                coordinates : [75.9268747,40.3356483]
            }
        });
        await camp.save();
    }
}

seeddb().then(() => mongoose.connection.close());
