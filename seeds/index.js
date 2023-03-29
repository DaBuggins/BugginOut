const mongoose = require('mongoose');
const cities = require('./cities');
const { descriptors, bugNames, sciName } = require('./seedHelpers');
const Bug = require('../models/bugs');



mongoose.set('strictQuery', false);
mongoose.connect('mongodb://127.0.0.1:27017/buggin-out');


const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Bug.deleteMany({});
    for (let i = 0; i < 200; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const bug = new Bug({
            author: '640c5e56ec97adc24412115e',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            geometry: {
              type: "Point",
              coordinates: [
                cities[random1000].longitude,
                cities[random1000].latitude,
              ]
            },
            name: `${sample(descriptors)} ${sample(bugNames)}`,
            sciName: `${sample(sciName)}`,
            description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Laboriosam ea corporis placeat dolores enim id vero atque rem, inventore obcaecati excepturi magnam, quae, doloribus voluptates earum? Minima, atque est. Odio.',
            images: [
                {
                  url: 'https://res.cloudinary.com/deskiol0z/image/upload/v1679138839/BugginOut/x0g8avsptzrmlxiv8jrf.jpg',
                  filename: 'BugginOut/x0g8avsptzrmlxiv8jrf',
                },
                {
                  url: 'https://res.cloudinary.com/deskiol0z/image/upload/v1679138840/BugginOut/qyy6hgozxort0dcrgnsg.jpg',
                  filename: 'BugginOut/qyy6hgozxort0dcrgnsg',
                },
                {
                  url: 'https://res.cloudinary.com/deskiol0z/image/upload/v1679138840/BugginOut/rxx0hopbzpn0nacmft6y.jpg',
                  filename: 'BugginOut/rxx0hopbzpn0nacmft6y',
                },
                {
                  url: 'https://res.cloudinary.com/deskiol0z/image/upload/v1679138840/BugginOut/ivvt9fjpk5r2yaqp2fn9.jpg',
                  filename: 'BugginOut/ivvt9fjpk5r2yaqp2fn9',
                }
              ]
        })
        await bug.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
});
