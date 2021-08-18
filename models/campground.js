const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create a Schema
const campGroundSchema = new Schema({
  title: String,
  price: String,
  description: String,
  location: String,
});

// compiling our schema into a Model.
const CampGround = mongoose.model("CampGround", campGroundSchema);

module.exports = CampGround;
