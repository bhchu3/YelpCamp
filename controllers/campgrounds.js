const CampGround = require("../models/campground");

// // create campgrounds route, create campgrounds folder and index.ejs and display title all of them using <ul>
module.exports.index = async (req, res) => {
  const campgrounds = await CampGround.find({});
  res.render("campgrounds/index", { campgrounds });
};

// new campground form
module.exports.renderNewForm = (req, res) => {
  res.render("campgrounds/new");
};

// making a new campground post request
module.exports.createCampground = async (req, res, next) => {
  const campground = new CampGround(req.body.campground);
  campground.images = req.files.map((f) => {
    return {
      url: f.path,
      filename: f.filename,
    };
  });
  campground.author = req.user._id;
  await campground.save();
  console.log(campground);
  req.flash("success", "Successfully made a new campground!");
  res.redirect(`/campgrounds/${campground._id}`);
};

// Show route with campground id
module.exports.showCampground = async (req, res) => {
  const campground = await CampGround.findById(req.params.id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("author");
  console.log(campground);
  if (!campground) {
    req.flash("error", "Cannot find that campground");
    return res.redirect("/campgrounds");
  }
  res.render("campgrounds/show", { campground });
};

// edit campground form
module.exports.renderEditForm = async (req, res) => {
  const { id } = req.params;
  const campground = await CampGround.findById(id);
  if (!campground) {
    req.flash("error", "Cannot find that campground");
    return res.redirect("/campgrounds");
  }
  res.render("campgrounds/edit", { campground });
};

// update campground
module.exports.updateCampground = async (req, res) => {
  const { id } = req.params;

  const campground = await CampGround.findByIdAndUpdate(
    id,
    { ...req.body.campground },
    {
      new: true,
    }
  );
  req.flash("success", "Successfully edit a campground!");
  res.redirect(`/campgrounds/${campground._id}`);
};

// Delete Campground
module.exports.deleteCampground = async (req, res) => {
  const { id } = req.params;
  await CampGround.findByIdAndDelete(id);
  req.flash("success", "deleted campground!");
  res.redirect("/campgrounds");
};
