const Listing = require("./models/listing");
const Review = require("./models/review");
const { listSchema, reviewSchema } = require("./schema");
const ExpressError = require("./utils/ExpressError");

module.exports.listingValidation = (req, res, next) => {
  let { error } = listSchema.validate(req.body);
  if (error) {
    let errorMsg = error.details[0].message;
    return next(new ExpressError(400, errorMsg));
  }
  next();
};

module.exports.reviewValidation = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);
  if (error) {
    let errorMsg = error.details[0].message;
    return next(new ExpressError(400, errorMsg));
  }
  next();
};

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
