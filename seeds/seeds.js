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

const random = array => array[Math.floor(Math.random() * array.length)];

/**
 * The function `seeddb` populates a database with 50 campground entries using random descriptors,
 * places, cities, and images.
*/
const seeddb = async () => {
  await campground.deleteMany({});
  for (let i=0; i<200; i++) {
      const random1000 = Math.floor(Math.random() * 1000)
        const camp = new campground({
            title : `${random(descriptors)} ${random(places)}`,
            city : cities[random1000].city,
            state : cities[random1000].state,
            author : '6841eb7470c336959b27028e',
            image : [
    {
      url: 'https://res.cloudinary.com/drtjoxefc/image/upload/v1750390890/CampScape/jtcandgfhgf9cc7l2vjv.jpg',
      filename: 'CampScape/jtcandgfhgf9cc7l2vjv'
    },
    {
      url: 'https://res.cloudinary.com/drtjoxefc/image/upload/v1750390888/CampScape/uu26rslq8ivm03p4rfib.jpg',
      filename: 'CampScape/uu26rslq8ivm03p4rfib'
    }
  ],
            description : "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod.",
            price : Math.floor(Math.random() * 20) + 10,
            geometry : {
                type : "Point",
                coordinates : [
                  cities[random1000].longitude,
                  cities[random1000].latitude
                ]
            }
        });
        await camp.save();
    }
}

seeddb().then(() => mongoose.connection.close());
