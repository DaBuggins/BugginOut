const dotenv = require("dotenv");
dotenv.config();

const mongoose = require('mongoose');
const cities = require('./cities');
const { descriptors, bugNames, sciName } = require('./seedHelpers');
const Bug = require('../models/bugs');
const { url } = require('./images');
const dbUrl = process.env.DB_URL;
const ObjectId = require('mongodb').ObjectId;




mongoose.set('strictQuery', false);
// mongoose.connect('mongodb://127.0.0.1:27017/buggin-out'); 
mongoose.connect(dbUrl);


const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected and seeded");
});

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Bug.deleteMany({});
    for (let i = 0; i < 200; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const bug = new Bug({
            author:   sample([{
              _id: "646e454923f1421544c4c81a",
              email: 'bob@bob.com',
              username: 'bob',
              salt: '06a786f6c77130e857c1212e0a11319979d09e20c94d85795b1778a7b77bc8a1',
              hash: '029178025bd3ed8aa96cf9c277748dd574868159e902272eaaf30b7efc28ad14da44a3655cde017ae754b0de9a1af7e7586fa6d48b5b3fe49400693bafa4c7e7cb618bb32ae24b223cdae6484271ad7d1b8751534b2eb76ff095530ac24a2e8a6168365bcd5e64cf6467e495d63b732fc693babd76f3fdc06db7106f5cf7775a9a4c7c2bab533cdfde9f6b4ec75dba79a4e2cb5f1a77a37f76570e23358b9836387817c8fe3e9396fbc163f1b89cb89951afbebee23e66a7c254856e9b04eaf3ee57e0dfe5c0d1a262d93f6a85db200208f8a46d29c5f89c89e8855e7b4afdb404b50a27f8fc91fd58508d65656e4c84701c53be5863273bf962e95b07be96ee4467519532641f9583fa85f698a00995634767528cac699106fce077d0d868e5fd15e0930ec1f494c41483b18d156f4ad97026c1762bfb1775b71a66efb4ed969d4cdc9756422a228b37084b987c9a62779a66c2e6b20c8885d5df4b8dd6454e1c99ae3bcf9eddeab8bc886edc28a41028a3134102e6cba3f9f7f047022ed099370fadb7e9e31dcc046b732e71eabd7e2709ab19303d617b5a3b8ede60a9528eb1cce6651d470b55c7d27496497bd5c05f8af8c0aa0ff6236cea69280b6625ed0b99366dd61e224dcc85e8e147c0bd86d0e0cc1376a0c6141ab3322500aec92c0732d6eb5de0973b2ddc6226a81c10355dff5cb6ba073f5643cd397b5afe0158',
              __v: 0
            },
            {
              _id: "65ea02907fef3fe0753fc8c3",
              email: 'jess@j',
              username: 'jess',
              salt: '69e9e81a8e3b909be183731641f86f44e49d070e6f551b9343165c08adef8653',
              hash: '1924066d0ec884ce1932f456dd4f5c2044073194a08ce9e192ae7f02ec59ae0dfe9a4a281f1796791a7cffb217a259867a46e9da9a3a67849121b5360c91ba1ecda9de2b180694b6035b61520e610a7b5a09a09ff76d19aa1fb6a51a6724207b76f2d09153c8ab5a842319718ebbdab5c8c686ec55cdee6ca9928b6107b005b06b49a676a41973496caa48c1fdfe5a2c116bf32e7e37548627254b9c3a8847f92b91ca8d5c0f6dec4efe1279c60c58e957874c0889fddda11f6544bca3d6e24f00d4d4894eefd2d1eba234f63830329cdd15f0d39d2f44e8bcbb05a44fcacdea8e4c9c07ed253594889f70dd7188175bea079a9859846d753008287ee95fd80ec8fcbe3dc0725ff82092133d659d75899c7c3858bb582374bc7b31eb196539837fd4321230b5e6d8b1fa60b149a67eaa1e29a9adf6ad2954ff0b5839f4ff37117ec13da657f4c02f6bbcd866545942238159c9fab0c3f4dc51464911e11e77d4e83fb7f7652af0b9894b2d663ebaabc693658cccd3404cb192c96986abb039660dc7005843b43f27ace61504a8acf6c6a6c075c8e13392a4c08724a41c9b85e88de83853e868573daf870902088dd37d670fd6a1012c9984c578e2c6a1e4aace7c2562f82d60b29a45c5cdd984aebd344f306ce0e2145470311613fde515b38691df053365b2a86ffe619aac267752990ea92dc33f2dcfb55322d74bc7493992',
              __v: 0
            }]),
            
            // '646e46c1f5fe3ce65d5a626f'
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
            images: 
              {
                url: `${sample(url)}`,
                filename: 'BugginOut/x0g8avsptzrmlxiv8jrf',
              },                  
        })
        await bug.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
});
