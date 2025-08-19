const mongoose = require("mongoose");
const Review = require("./review.js");
const { Schema } = require("mongoose");
const { required } = require("joi");

const listingSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },

  description: {
    type: String,
    required: true,
  },

  image: {
    url: String,
    filename: String,
    // type: String,
    // default:
    //   "https://plus.unsplash.com/premium_photo-1748729621110-2a54d1167ba7?q=80&w=1113&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    // set: (v) =>
    //   v === ""
    //     ? "https://plus.unsplash.com/premium_photo-1748729621110-2a54d1167ba7?q=80&w=1113&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    //     : v, //ternary operator  //if lister has given "" as value in the image field
  },

  price: {
    type: Number,
    required: true,
  },

  location: {
    type: String,
    required: true,
  },

  country: {
    type: String,
    required: true,
  },

  reviews: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  geometry: {
    type: {
      type: String, // Don't do `{ geometry: { type: String } }`
      enum: ["Point"], // 'geometry.type' must be 'Point'
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
  category: {
    type: String,
    enum: [
      "Trending",
      "Room",
      "Mountains",
      "Amazing Pools",
      "Camping",
      "Farms",
      "Castles",
      "Parks",
      "Resorts",
      "Apartments",
    ],
  },
});

listingSchema.post("findOneAndDelete", async (res) => {
  if (res) {
    await Review.deleteMany({ _id: { $in: res.reviews } });
  }
});

const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;
