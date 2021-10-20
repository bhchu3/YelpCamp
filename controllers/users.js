const User = require("../models/user");

// user register render page
module.exports.renderRegister = (req, res) => {
  res.render("users/register");
};

// user register post route
module.exports.register = async (req, res, next) => {
  try {
    const { email, username, password } = req.body;
    const user = new User({ email, username });
    const registerdUser = await User.register(user, password);
    req.login(registerdUser, function (err) {
      if (err) {
        return next();
      } else {
        req.flash("success", "Welcome to YelpCamp");
        res.redirect("/campgrounds");
      }
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/register");
  }
};

// user render login form
module.exports.renderLogin = (req, res) => {
  res.render("users/login");
};

// user login
// FMI http://www.passportjs.org/docs/authenticate/
module.exports.login = (req, res) => {
  req.flash("success", "Welcome Back!");
  const redirectUrl = req.session.returnTo || "/campgrounds";
  delete req.session.returnTo;
  res.redirect(redirectUrl);
};

// user logout
module.exports.logout = (req, res) => {
  req.logout();
  req.flash("success", "GoodBye!");
  res.redirect("/campgrounds");
};
