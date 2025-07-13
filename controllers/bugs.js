const Bug = require("../models/bugs");
const mapBoxToken = process.env.MAPBOX_TOKEN;
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");

const geocoder = mbxGeocoding({ accessToken: mapBoxToken });
const { cloudinary } = require("../cloudinary");

module.exports.index = async (req, res) => {  
  const limit = 21;
  let page = 1; 
  if (req.query.page) {
    page = req.query.page
  }
  const offset = (page - 1) * limit;
  const bugs = await Bug.find()
    .skip(offset)
    .limit(limit); 
  
  res.render("bugs/index", { bugs });
};

module.exports.renderNewForm = (req, res) => {
  res.render("bugs/new");
};

module.exports.createBug = async (req, res, next) => {
  const geoData = await geocoder
    .forwardGeocode({
      query: req.body.bug.location,
      limit: 1,
    })
    .send()
  const bug = new Bug(req.body.bug);
  bug.geometry = geoData.body.features[0].geometry;
  bug.images = req.files.map((f) => ({ url: f.path, filename: f.filename }));
  bug.author = req.user._id;
  await bug.save();
  console.log(bug);
  req.flash("success", "Sucessfully created a new bug page!");
  res.redirect(`/bugs/${bug._id}`);
};

module.exports.showBug = async (req, res) => {
  const bug = await Bug.findById(req.params.id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("author");
  if (!bug) {
    req.flash("error", "Cannot find that bug");
    res.redirect("/bugs");
  }
  res.render("bugs/show", { bug });
};

module.exports.renderEditForm = async (req, res) => {
  const { id } = req.params;
  const bug = await Bug.findById(id);
  if (!bug) {
    req.flash("error", "Cannot find that bug");
    res.redirect("/bugs");
  }

  res.render("bugs/edit", { bug });
};

module.exports.updateBug = async (req, res) => {
  const { id } = req.params;
  console.log(req.body);
  const bug = await Bug.findByIdAndUpdate(id, { ...req.body.bug });
  const imgs = req.files.map((f) => ({ url: f.path, filename: f.filename }));
  bug.images.push(...imgs);
  await bug.save();
  if (req.body.deleteImages) {
    for (let filename of req.body.deleteImages) {
      await cloudinary.uploader.destroy(filename);
    }
    await bug.updateOne({
      $pull: { images: { filename: { $in: req.body.deleteImages } } },
    });
  }
  req.flash("success", "Successfully updated bug page!");
  res.redirect(`/bugs/${bug._id}`);
};

module.exports.deleteBug = async (req, res) => {
  const { id } = req.params;
  await Bug.findByIdAndDelete(id);
  req.flash("success", "Sucessfully deleted bug");
  res.redirect("/bugs");
};
