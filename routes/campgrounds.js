const express = require("express");
const router = express.Router();
const catchAsync = require("../helper/catchAsync");
const ExpressError = require("../helper/expressError");
const CampGround = require("../models/campground");
const { campgroundsSchema } = require("../schemas");

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

// create campgrounds route, create campgrounds folder and index.ejs and display title all of them using <ul>
router.get(
  "/",
  catchAsync(async (req, res) => {
    const campgrounds = await CampGround.find({});
    res.render("campgrounds/index", { campgrounds });
  })
);

// Create new campground route
router.get("/new", (req, res) => {
  res.render("campgrounds/new");
});

router.post(
  "/",
  validateCampground,
  catchAsync(async (req, res) => {
    const newCamp = new CampGround(req.body.campground);
    await newCamp.save();
    req.flash("success", "Successfully made a new campground!");
    res.redirect(`/campgrounds/${newCamp._id}`);
  })
);

// Show route with campground id
router.get(
  "/:id",
  catchAsync(async (req, res) => {
    const campground = await CampGround.findById(req.params.id).populate(
      "reviews"
    );
    res.render("campgrounds/show", { campground });
  })
);

// ---- Edit route with Put Request ( need npm install method override for put request)
router.get(
  "/:id/edit",
  catchAsync(async (req, res) => {
    const campground = await CampGround.findById(req.params.id);
    res.render("campgrounds/edit", { campground });
  })
);

router.put(
  "/:id",
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
router.delete(
  "/:id",
  catchAsync(async (req, res) => {
    const { id } = req.params;
    await CampGround.findByIdAndDelete(id);
    res.redirect("/campgrounds");
  })
);

module.exports = router;
