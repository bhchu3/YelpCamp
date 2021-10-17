const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const flash = require("connect-flash");
const methodOverride = require("method-override");
const ExpressError = require("./helper/expressError");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user");

// All Routes
const userRoutes = require("./routes/users");
const campgroundsRoutes = require("./routes/campgrounds");
const reviewsRoutes = require("./routes/reviews");

// Mongoose setup
mongoose.connect("mongodb://localhost:27017/yelp-camp", {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  console.log("mogoose connected!!");
});

const app = express();
// ejs-mate
app.engine("ejs", ejsMate);

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

//for post request
app.use(express.urlencoded({ extended: true }));
// override with POST having ?_method=DELETE
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

// session
const sessionConfig = {
  secret: "thisshouldbeabettersecret",
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};
app.use(session(sessionConfig));

// flash
app.use(flash());

/* 
In a Connect or Express-based application, passport.initialize() 
middleware is required to initialize Passport. 
If your application uses persistent login sessions, 
passport.session() middleware must also be used.
http://www.passportjs.org/docs/downloads/html/
 be sure to use session() before passport.session() 
 to ensure that the login session is restored in the 
 correct order.
*/
app.use(passport.initialize());
app.use(passport.session());

// the authenticate() from passport-local-mongoose
passport.use(new LocalStrategy(User.authenticate()));
// https://github.com/saintedlama/passport-local-mongoose/blob/main/README.md#api-documentation
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

// Routes handler
app.use("/", userRoutes);
app.use("/campgrounds", campgroundsRoutes);
app.use("/campgrounds/:id/reviews", reviewsRoutes);

app.get("/", (req, res) => {
  res.render("home");
});

// !! important !! the code below only run when above routes is not found, so order is important
app.all("*", (req, res, next) => {
  next(new ExpressError("Page Not Found", 404)); // this next will pass the err to the error middleware
});

// Error-handling middleware function
app.use((err, req, res, next) => {
  const { message = "Sometime went Wrong!", statusCode = 500 } = err;
  res.status(statusCode).render("error", { err });
});

app.listen(3000, () => {
  console.log("connected to port 3000");
});
