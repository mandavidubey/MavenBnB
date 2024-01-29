const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review");

let listSchema = new Schema({
  title: {
    type: String,
    reqired: true,
  },
  description: {
    type: String,
  },
  image: {
    url: String,
    fileName: String,
  },
  price: Number,
  location: String,
  country: String,
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
    reqired: true,
  },
  geometry: {
    type: {
      type: String,
      enum: ["Point"],
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
});

listSchema.post("findOneAndDelete", async (listing) => {
  if (listing) {
    await Review.deleteMany({ _id: { $in: listing.reviews } });
  }
});

const Listing = mongoose.model("listing", listSchema);

module.exports = Listing;
