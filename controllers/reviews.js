const Review = require("../models/review");
const Bug = require("../models/bugs");

module.exports.createReview = async (req, res) => {
    const bug = await Bug.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    bug.reviews.push(review);
    await review.save();
    await bug.save();
    req.flash("success", "Successfully created review!");
    res.redirect(`/bugs/${bug._id}`);
  }

  module.exports.deleteReview = async (req, res) => {
    const { id, reviewId } = req.params;
    await Bug.findByIdAndUpdate(id, { $pull: { review: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Successfully deleted review!");
    res.redirect(`/bugs/${id}`);
  }