const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const methodOverride = require("method-override");

const CampGround = require("./models/campground");
const Review = require("./models/reviews");
const catchAsync = require("./helper/catchAsync");
const ExpressError = require("./helper/expressError");
const { campgroundsSchema, reviewsSchema } = require("./schemas");

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

// ejs-mate
app.engine("ejs", ejsMate);

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

//for post request
app.use(express.urlencoded({ extended: true }));
// override with POST having ?_method=DELETE
app.use(methodOverride("_method"));

// Joi validate middleware
const validateCampground = (req, res, next) => {
  const { error } = campgroundsSchema.validate(req.body);
  // below if statement only defined when there is a error
  if (error) {
    const messages = error.details.map((el) => el.message).join(",");
    // we have the catchAsync Function so when we throw the err express
    // able to catch it and pass it to error handler middleware function.
    throw new ExpressError(messages, 400);
  } else {
    next();
  }
};

const validateReview = (req, res, next) => {
  const { error } = reviewsSchema.validate(req.body);
  // below if statement only defined when there is a error
  if (error) {
    const messages = error.details.map((el) => el.message).join(",");
    // we have the catchAsync Function so when we throw the err express
    // able to catch it and pass it to error handler middleware function.
    throw new ExpressError(messages, 400);
  } else {
    next();
  }
};

app.get("/", (req, res) => {
  res.render("home");
});

// create campgrounds route, create campgrounds folder and index.ejs and display title all of them using <ul>
app.get(
  "/campgrounds",
  catchAsync(async (req, res) => {
    const campgrounds = await CampGround.find({});
    res.render("campgrounds/index", { campgrounds });
  })
);

// Create new campground route
app.get("/campgrounds/new", (req, res) => {
  res.render("campgrounds/new");
});

app.post(
  "/campgrounds",
  validateCampground,
  catchAsync(async (req, res, next) => {
    const newCamp = new CampGround(req.body.campground);
    await newCamp.save();
    res.redirect(`/campgrounds/${newCamp._id}`);
  })
);

// Show route with campground id
app.get(
  "/campgrounds/:id",
  catchAsync(async (req, res) => {
    const campground = await CampGround.findById(req.params.id).populate(
      "reviews"
    );
    res.render("campgrounds/show", { campground });
  })
);

// POST review rating with campground id
app.post(
  "/campgrounds/:id/reviews",
  validateReview,
  catchAsync(async (req, res, next) => {
    const campground = await CampGround.findById(req.params.id);
    const review = new Review(req.body.review);
    await campground.reviews.push(review);
    await review.save();
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
  })
);

// ---- Edit route with Put Request ( need npm install method override for put request)
app.get(
  "/campgrounds/:id/edit",
  catchAsync(async (req, res) => {
    const campground = await CampGround.findById(req.params.id);
    res.render("campgrounds/edit", { campground });
  })
);

app.put(
  "/campgrounds/:id",
  validateCampground,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await CampGround.findByIdAndUpdate(
      id,
      { ...req.body.campground },
      {
        new: true,
      }
    );
    res.redirect(`/campgrounds/${campground._id}`);
  })
);

// Delete route
app.delete(
  "/campgrounds/:id",
  catchAsync(async (req, res) => {
    const { id } = req.params;
    await CampGround.findByIdAndDelete(id);
    res.redirect("/campgrounds");
  })
);

// !! important !! the code below only run when above routes is not found, so order is important
app.all("*", (req, res, next) => {
  next(new ExpressError("Page Not Found", 404)); // this next will pass the err to the error middleware
});

// Error-handling middleware function
app.use((err, req, res, next) => {
  const { message = "Sometime went Wrong!", statusCode = 500 } = err;
  res.status(statusCode).render("error", { err });
});

app.listen(3000, () => {
  console.log("connected to port 3000");
});
