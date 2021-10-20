const { campgroundsSchema, reviewsSchema } = require("./schemas");
const ExpressError = require("./helper/expressError");
const CampGround = require("./models/campground");

module.exports.isLoggedIn = (req, res, next) => {
  // .isAuthenticated() is a method from passport.js
  // this function checks if the user is successfully logged in;
  // if it is, then it returns true, otherwise, it returns false.
  if (!req.isAuthenticated()) {
    req.session.returnTo = req.originalUrl;
    req.flash("error", "You must sign in");
    return res.redirect("/login");
  }
  next();
};

// Joi validate middleware
module.exports.validateCampground = (req, res, next) => {
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

//  Joi validate middleware
module.exports.validateReview = (req, res, next) => {
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

// Authorization Middleware to check is it the right author to edit/delete
module.exports.isAuthor = async (req, res, next) => {
  const { id } = req.params;
  const campground = await CampGround.findById(id);
  if (!campground.author.equals(req.user._id)) {
    req.flash("error", "You do not have permission to do that");
    return res.redirect(`/campgrounds/${id}`);
  }
  next();
};
