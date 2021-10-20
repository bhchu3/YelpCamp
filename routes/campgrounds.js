const express = require("express");
const router = express.Router();
const campgrounds = require("../controllers/campgrounds");
const catchAsync = require("../helper/catchAsync");
const CampGround = require("../models/campground");
const { isLoggedIn, isAuthor, validateCampground } = require("../middleware");

// create campgrounds route, create campgrounds folder and index.ejs and display title all of them using <ul>
router.get("/", catchAsync(campgrounds.index));

// new campground form
router.get("/new", isLoggedIn, campgrounds.renderNewForm);

// making a new campground post request
router.post(
  "/",
  isLoggedIn,
  validateCampground,
  catchAsync(campgrounds.createCampground)
);

// Show route with campground id
router.get("/:id", catchAsync(campgrounds.showCampground));

// ---- Edit route with Put Request ( need npm install method override for put request)
router.get(
  "/:id/edit",
  isLoggedIn,
  isAuthor,
  catchAsync(campgrounds.renderEditForm)
);

router.put(
  "/:id",
  isLoggedIn,
  isAuthor,
  validateCampground,
  catchAsync(campgrounds.updateCampground)
);

// Delete route
router.delete(
  "/:id",
  isLoggedIn,
  isAuthor,
  catchAsync(campgrounds.deleteCampground)
);

module.exports = router;
