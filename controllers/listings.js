const Listing = require("../models/listing");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index = async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
};

module.exports.renderNewForm = (req, res) => {
  res.render("listings/new.ejs");
};

module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("owner");
  if (!listing) {
    req.flash("error", "Listing You Requested Does Not Exist !");
    res.redirect("/listings");
  }
  console.log(listing);
  res.render("listings/show.ejs", { listing });
};

module.exports.createListing = async (req, res) => {
  let response = await geocodingClient
    .forwardGeocode({
      query: req.body.listing.location,
      limit: 1,
    })
    .send();

  let newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  let url = req.file.path;
  let fileName = req.file.filename;
  newListing.image = {url, fileName};
  newListing.geometry = response.body.features[0].geometry;
  await newListing.save();

  req.flash("success", "New Listing created successfully!");
  res.redirect("/listings");
};

module.exports.renderEditForm = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing You Requested Does Not Exist !");
    return res.redirect("/listings");
  }
  let originalImageUrl = listing.image.url;
  originalImageUrl = originalImageUrl.replace(
    "/upload",
    "/upload/w_300,h_150/"
  );
  res.render("listings/edit.ejs", { listing, originalImageUrl });
};

module.exports.updateListing = async (req, res) => {
  // let response = await geocodingClient
  //   .forwardGeocode({
  //     query: req.body.location,
  //     limit: 1,
  //   })
  //   .send();

  let { id } = req.params;
  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

  if (typeof req.file !== "undefined") {
    let url = req.file.path;
    let fileName = req.file.filename;
    listing.image = { url, fileName };
  }

  //listing.geometry = response.body.features[0].geometry;
  await listing.save();
  req.flash("success", "Listing Updated !");
  await res.redirect(`/listings/${id}`);
};

module.exports.deleteListing = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findByIdAndDelete(id);
  console.log(`${listing.title} is Deleted`);
  req.flash("success", "Listing Deleted !");
  res.redirect("/listings");
};
