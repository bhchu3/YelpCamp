const { func } = require("joi");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./reviews");

// Create a Schema
const campGroundSchema = new Schema({
  title: String,
  images: [{ url: String, filename: String }],
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
