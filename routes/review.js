const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const reviewController = require("../controllers/reviews.js");
const {
  handleRevErr,
  authenticateUser,
  isReviewAuthor,
} = require("../middleware.js");
const User = require("../models/user.js");

//REVIEWS

//POST REVIEW ROUTE
router.post(
  "/",
  authenticateUser,
  handleRevErr,
  wrapAsync(reviewController.postNewReview)
);

//DELETE REVIEW BUTTON
router.delete(
  "/:reviewId",
  authenticateUser,
  isReviewAuthor,
  wrapAsync(reviewController.deleteReview)
);

module.exports = router;
