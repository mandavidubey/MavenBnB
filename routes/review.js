const express = require("express");
const wrapAsync = require("../utils/wrapAsync");

const {
  isLoggedIn,
  reviewValidation,
  isReviewAuthor,
} = require("../middleware.js");

const reviewController = require("../controllers/review");
const router = express.Router({ mergeParams: true });

//Review (POST Routes)
router.post(
  "/",
  isLoggedIn,
  reviewValidation,
  wrapAsync(reviewController.addReview)
);

// DELETE Review Route
router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  wrapAsync(reviewController.deleteReview)
);

module.exports = router;
