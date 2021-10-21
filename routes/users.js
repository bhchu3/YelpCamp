const express = require("express");
const router = express.Router();
const User = require("../models/user");
const catchAsync = require("../helper/catchAsync");
const passport = require("passport");
const users = require("../controllers/users");

// FMI http://expressjs.com/zh-tw/api.html#router
//  Use router.route() to avoid duplicate route naming and thus typing errors.
router
  .route("/register")
  .get(users.renderRegister)
  .post(catchAsync(users.register));

router
  .route("/login")
  .get(users.renderLogin)
  .post(
    // login post route
    // FMI http://www.passportjs.org/docs/authenticate/
    passport.authenticate("local", {
      failureFlash: true,
      failureRedirect: "/login",
    }),
    users.login
  );

// user logout
router.get("/logout", users.logout);

module.exports = router;
