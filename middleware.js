const { bugSchema, reviewSchema } = require("./schemas");
const ExpressError = require("./utils/ExpressError");
const Bug = require("./models/bugs");
const Review = require("./models/review");


// checks if user is logged in
module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.returnTo = req.originalUrl;
    req.flash("error", "You must be signed in first!");
    return res.redirect("/login");
  }
  next();
};

// schema validation for new bug
module.exports.validateBug = (req, res, next) => {
  const { error } = bugSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

// checks if user is author of the bug
module.exports.isAuthor = async (req, res, next) => {
  const { id } = req.params;
  const bug = await Bug.findById(id);
  if (!bug.author.equals(req.user._id)) {
    req.flash("error", "You do not have permission for that");
    return res.redirect(`/bugs/${id}`);
  }
  next();
};

// checks if user is author of the review
module.exports.isReviewAuthor = async (req, res, next) => {
  const { id, reviewId } = req.params;
  const review = await Review.findById(reviewId);
  if (!review.author.equals(req.user._id)) {
    req.flash("error", "You do not have permission for that");
    return res.redirect(`/bugs/${id}`);
  }
  next();
};

// schema validation for new review
module.exports.validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};
