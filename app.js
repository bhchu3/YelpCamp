const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const CampGround = require("./models/campground");

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

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("index");
});

// ToDo** create makecampground route title: MyBackyard, description: cheap camping
app.get("/makecampground", async (req, res) => {
  const camp = new CampGround({
    title: "My Backyard",
    description: "cheap camping",
  });
  await camp.save();
  res.send(camp);
});

app.listen(3000, () => {
  console.log("connected to port 3000");
});
