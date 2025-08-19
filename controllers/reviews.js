const Listing = require("../models/listings.js");
const Review = require("../models/review.js");

module.exports.postNewReview = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);

  let newReview = new Review(req.body.review);
  newReview.author = res.locals.currUser._id;
  // console.log(newReview);

  listing.reviews.push(newReview);

  await newReview.save();
  await listing.save();

  req.flash("success", "review posted successfully");
  // console.log("new review added");
  res.redirect(`/listings/${id}`);
};

module.exports.deleteReview = async (req, res) => {
  let { id, reviewId } = req.params;

  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);

  req.flash("success", "review deleted successfully");
  // console.log("review deleted successfully");
  res.redirect(`/listings/${id}`);
};
