const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const methodOverride = require("method-override");
const ExpressError = require("./helper/expressError");

const campgrounds = require("./routes/campgrounds");
const reviews = require("./routes/reviews");

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

app.use("/campgrounds", campgrounds);
app.use("/campgrounds/:id/reviews", reviews);

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
