const express = require("express");
/* must pass {mergeParams: true} to the child router 
 if you want to access the params from the parent router. 
 https://stackoverflow.com/questions/25260818/rest-with-express-js-nested-router */
const router = express.Router({ mergeParams: true });
const catchAsync = require("../helper/catchAsync");
const CampGround = require("../models/campground");
const Review = require("../models/reviews");
const ExpressError = require("../helper/expressError");
const { validateReview } = require("../middleware");

// POST Review rating with campground id
router.post(
  "/",
  validateReview,
  catchAsync(async (req, res) => {
    const campground = await CampGround.findById(req.params.id);
    const review = new Review(req.body.review);
    await campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash("success", "Created new Review");
    res.redirect(`/campgrounds/${campground._id}`);
  })
);

// Delete Review
// The $pull operator removes from an existing array all instances of a value or values
// that match a specified condition.
// https://docs.mongodb.com/manual/reference/operator/update/pull/#mongodb-update-up.-pull
router.delete(
  "/:reviewId",
  catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await CampGround.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review deleted!");
    res.redirect(`/campgrounds/${id}`);
  })
);

module.exports = router;
