const express = require("express");
const router = express.Router();
const User = require("../models/user");
const catchAsync = require("../helper/catchAsync");
const passport = require("passport");
const users = require("../controllers/users");

// user register render page
router.get("/register", users.renderRegister);

// user register post route
router.post("/register", catchAsync(users.register));

// user render login form
router.get("/login", users.renderLogin);

// login post route
// FMI http://www.passportjs.org/docs/authenticate/
router.post(
  "/login",
  passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "/login",
  }),
  users.login
);

// user logout
router.get("/logout", users.logout);

module.exports = router;
