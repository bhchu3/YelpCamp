const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
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

//for post request
app.use(express.urlencoded({ extended: true }));
// override with POST having ?_method=DELETE
app.use(methodOverride("_method"));

app.get("/", (req, res) => {
  res.render("home");
});

// create campgrounds route, create campgrounds folder and index.ejs and display title all of them using <ul>
app.get("/campgrounds", async (req, res) => {
  const campgrounds = await CampGround.find({});
  res.render("campgrounds/index", { campgrounds });
});

// Create new campground route
app.get("/campgrounds/new", (req, res) => {
  res.render("campgrounds/new");
});

app.post("/campgrounds", async (req, res) => {
  const newCamp = new CampGround(req.body);
  await newCamp.save();
  res.redirect(`/campgrounds/${newCamp._id}`);
});

// Show route with campground id
app.get("/campgrounds/:id", async (req, res) => {
  const campground = await CampGround.findById(req.params.id);
  res.render("campgrounds/show", { campground });
});

// ---- Edit route with Put Request ( need npm install method override for put request)
app.get("/campgrounds/:id/edit", async (req, res) => {
  const campground = await CampGround.findById(req.params.id);
  res.render("campgrounds/edit", { campground });
});

app.put("/campgrounds/:id", async (req, res) => {
  const { id } = req.params;
  const campground = await CampGround.findByIdAndUpdate(
    id,
    { ...req.body },
    {
      new: true,
    }
  );
  res.redirect(`/campgrounds/${campground._id}`);
});

// Delete Campground
app.delete("/campgrounds/:id", async (req, res) => {
  const { id } = req.params;
  await CampGround.findByIdAndDelete(id);
  res.redirect("/campgrounds");
});

app.listen(3000, () => {
  console.log("connected to port 3000");
});
