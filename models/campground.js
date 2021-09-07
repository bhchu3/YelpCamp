const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create a Schema
const campGroundSchema = new Schema({
  title: String,
  image: String,
  price: Number,
  description: String,
  location: String,
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
});

// compiling our schema into a Model.
const CampGround = mongoose.model("CampGround", campGroundSchema);

module.exports = CampGround;
