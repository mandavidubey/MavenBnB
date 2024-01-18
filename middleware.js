const Listing = require("./models/listing");
const Review = require("./models/review");
const ExpressError = require("./utils/ExpressError");

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl;
    req.flash("error", "You Must Be Logged in to Access Listing !");
    return res.redirect("/login");
  }
  next();
};

module.exports.saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};

module.exports.isOwner = async (req, res, next) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  if (!listing.owner._id.equals(res.locals.currUser._id)) {
    req.flash("error", "You Are Not The Owner Of This Listings !");
    return res.redirect(`/listings/${id}`);
  } else {
    next();
  }
};

module.exports.listingValidation = (req, res, next) => {
  if (Object.keys(req.body).length === 0) {
    throw new ExpressError(204, "Body Is Empty !");
  } else if (!req.body.title) {
    throw new ExpressError(404, "Title is missing");
  } else if (!req.body.description) {
    throw new ExpressError(404, "Description is missing");
  } else if (!req.body.price) {
    throw new ExpressError(404, "Price is missing");
  } else if (!req.body.country) {
    throw new ExpressError(404, "Countery is missing");
  } else if (!req.body.location) {
    throw new ExpressError(404, "Location is missing");
  } else {
    next();
  }
};

module.exports.reviewValidation = (req, res, next) => {
  if (Object.keys(req.body.review).length === 0) {
    throw new ExpressError(204, "Body Is Empty !");
  } else if (!req.body.review.comment) {
    throw new ExpressError(404, "Comment is missing");
  } else if (!req.body.review.rating) {
    throw new ExpressError(404, "Rating is missing");
  } else if (req.body.rating <= 5 || req.body.rating >= 1) {
    throw new ExpressError(404, "invalied Rating");
  } else {
    next();
  }
};

module.exports.isReviewAuthor = async (req, res, next) => {
  let { id, reviewId } = req.params;
  let review = await Review.findById(reviewId);
  if (!review.author._id.equals(res.locals.currUser._id)) {
    req.flash("error", "You Are Not The Author Of This Review !");
    return res.redirect(`/listings/${id}`);
  } else {
    next();
  }
};
