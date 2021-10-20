const express = require("express");
/* must pass {mergeParams: true} to the child router 
 if you want to access the params from the parent router. 
 https://stackoverflow.com/questions/25260818/rest-with-express-js-nested-router */
const router = express.Router({ mergeParams: true });
const reviews = require("../controllers/reviews");
const catchAsync = require("../helper/catchAsync");
const CampGround = require("../models/campground");
const Review = require("../models/reviews");
const ExpressError = require("../helper/expressError");
const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware");

// POST Review rating with campground id
router.post("/", isLoggedIn, validateReview, catchAsync(reviews.createReview));

// Delete Review
// The $pull operator removes from an existing array all instances of a value or values
// that match a specified condition.
// https://docs.mongodb.com/manual/reference/operator/update/pull/#mongodb-update-up.-pull
router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  catchAsync(reviews.deleteReview)
);

module.exports = router;
