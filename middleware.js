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
