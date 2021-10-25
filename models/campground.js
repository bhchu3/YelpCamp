const { func } = require("joi");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./reviews");

//https://res.cloudinary.com/bhchu3/image/upload/v1635146895/YelpCamp/ujdjgecvwcwrbs2tuhvh.jpg

// Create a Schema
const ImageSchema = new Schema({
  url: String,
  filename: String,
});

ImageSchema.virtual("thumbnail").get(function () {
  return this.url.replace("/upload", "/upload/w_200");
});

const campGroundSchema = new Schema({
  title: String,
  images: [ImageSchema],
  price: Number,
  description: String,
  location: String,
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
});

// Campground Delete Middleware
campGroundSchema.post("findOneAndDelete", async function (doc) {
  console.log(doc);
  if (doc) {
    await Review.deleteMany({
      _id: {
        $in: doc.reviews,
      },
    });
  }
});

// compiling our schema into a Model.
const CampGround = mongoose.model("CampGround", campGroundSchema);

module.exports = CampGround;
