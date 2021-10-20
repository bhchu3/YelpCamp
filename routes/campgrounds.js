const express = require("express");
const router = express.Router();
const catchAsync = require("../helper/catchAsync");
const CampGround = require("../models/campground");
const { isLoggedIn, isAuthor, validateCampground } = require("../middleware");

// create campgrounds route, create campgrounds folder and index.ejs and display title all of them using <ul>
router.get(
  "/",
  catchAsync(async (req, res) => {
    const campgrounds = await CampGround.find({});
    res.render("campgrounds/index", { campgrounds });
  })
);

// Create new campground route
router.get("/new", isLoggedIn, (req, res) => {
  res.render("campgrounds/new");
});

router.post(
  "/",
  isLoggedIn,
  validateCampground,
  catchAsync(async (req, res, next) => {
    const campground = new CampGround(req.body.campground);
    campground.author = req.user._id;
    await campground.save();
    req.flash("success", "Successfully made a new campground!");
    res.redirect(`/campgrounds/${campground._id}`);
  })
);

// Show route with campground id
router.get(
  "/:id",
  catchAsync(async (req, res) => {
    const campground = await CampGround.findById(req.params.id)
      .populate({ path: "reviews", populate: { path: "author" } })
      .populate("author");
    console.log(campground);
    if (!campground) {
      req.flash("error", "Cannot find that campground");
      return res.redirect("/campgrounds");
    }
    res.render("campgrounds/show", { campground });
  })
);

// ---- Edit route with Put Request ( need npm install method override for put request)
router.get(
  "/:id/edit",
  isLoggedIn,
  isAuthor,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await CampGround.findById(id);
    if (!campground) {
      req.flash("error", "Cannot find that campground");
      return res.redirect("/campgrounds");
    }
    res.render("campgrounds/edit", { campground });
  })
);

router.put(
  "/:id",
  isLoggedIn,
  isAuthor,
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
    req.flash("success", "Successfully edit a campground!");
    res.redirect(`/campgrounds/${campground._id}`);
  })
);

// Delete route
router.delete(
  "/:id",
  isLoggedIn,
  isAuthor,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    await CampGround.findByIdAndDelete(id);
    req.flash("success", "deleted campground!");
    res.redirect("/campgrounds");
  })
);

module.exports = router;
