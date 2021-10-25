const mongoose = require("mongoose");
const CampGround = require("../models/campground");
const cities = require("./cities");
const { descriptors, places } = require("./seedHelpers");

// Mongoose setup
mongoose.connect("mongodb://localhost:27017/yelp-camp", {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  console.log("mogoose connected!!");
});

const randomArray = (arr) => arr[Math.floor(Math.random() * arr.length)];

const seedDb = async () => {
  await CampGround.deleteMany();
  for (let i = 0; i < 50; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const price = Math.floor(Math.random() * 31) + 10;
    const camp = new CampGround({
      author: "616cb884ff890a29a4d06fcd",
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      title: `${randomArray(descriptors)} ${randomArray(places)}`,
      images: [
        {
          url: "https://res.cloudinary.com/bhchu3/image/upload/v1634882208/YelpCamp/i9cohjeemxcvbdeeoarx.jpg",
          filename: "YelpCamp/i9cohjeemxcvbdeeoarx",
        },
        {
          url: "https://res.cloudinary.com/bhchu3/image/upload/v1634882213/YelpCamp/dmss9jlvvzuqznbqwgmh.jpg",
          filename: "YelpCamp/dmss9jlvvzuqznbqwgmh",
        },
        {
          url: "https://res.cloudinary.com/bhchu3/image/upload/v1634882220/YelpCamp/gqkjozpmh11x4uvvy4we.jpg",
          filename: "YelpCamp/gqkjozpmh11x4uvvy4we",
        },
      ],
      price,
      description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime labore exercitationem culpa veritatis libero repellat eum error, ad, quia rem corrupti necessitatibus rerum accusantium quam voluptatibus saepe. Minima dicta est facilis accusamus cupiditate recusandae autem libero ratione similique! Minus maiores labore earum velit odit veniam quis nulla expedita optio sint debitis ipsam sequi nemo, aut incidunt dolore nam cupiditate possimus, iusto numquam reiciendis dolores eaque provident. Blanditiis omnis enim suscipit eaque provident, quidem voluptates error quam. Iusto a id officia accusantium et optio, earum, ducimus voluptate ut sed autem voluptas, doloremque distinctio pariatur facilis quas tempora recusandae quisquam. Alias, nesciunt.",
    });
    await camp.save();
  }
};

seedDb().then(() => mongoose.connection.close());
