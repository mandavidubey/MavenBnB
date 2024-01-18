const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const { isLoggedIn, isOwner, listingValidation } = require("../middleware");
const listingControllers = require("../controllers/listings");
const multer = require("multer");
const { storage } = require("../cloudCongif.js");
const upload = multer({ storage });

//NEW Route
router.get("/new", isLoggedIn, listingControllers.renderNewForm);

router
  .route("/")
  .get(wrapAsync(listingControllers.index))
  .post(
    isLoggedIn,
    upload.single("image"),
    // listingValidation,
    wrapAsync(listingControllers.createListing)
  );

router
  .route("/:id")
  .get(wrapAsync(listingControllers.showListing))
  .put(
    isLoggedIn,
    isOwner,
    upload.single("image"),
    listingValidation,
    wrapAsync(listingControllers.updateListing)
  )
  .delete(isLoggedIn, isOwner, wrapAsync(listingControllers.deleteListing));

// EDIT Route
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingControllers.editListing)
);

module.exports = router;
