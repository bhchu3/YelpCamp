const CampGround = require("../models/campground");
const Review = require("../models/reviews");

// POST Review rating with campground id
module.exports.createReview = async (req, res) => {
  const campground = await CampGround.findById(req.params.id);
  const review = new Review(req.body.review);
  review.author = req.user._id;
  await campground.reviews.push(review);
  await review.save();
  await campground.save();
  req.flash("success", "Created new Review");
  res.redirect(`/campgrounds/${campground._id}`);
};

// Delete Review
// The $pull operator removes from an existing array all instances of a value or values
// that match a specified condition.
// https://docs.mongodb.com/manual/reference/operator/update/pull/#mongodb-update-up.-pull
module.exports.deleteReview = async (req, res) => {
  const { id, reviewId } = req.params;
  await CampGround.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  req.flash("success", "Review deleted!");
  res.redirect(`/campgrounds/${id}`);
};
