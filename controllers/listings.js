const Listing = require("../models/listings.js");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapToken = process.env.MAP_API_KEY;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index = async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
};

module.exports.renderNewForm = (req, res) => {
  // console.log(req.user);
  res.render("listings/new.ejs");
};

module.exports.trending = async (req, res) => {
  const allListings = await Listing.find({ category: "Trending" });
  res.render("listings/index.ejs", { allListings });
};

module.exports.room = async (req, res) => {
  const allListings = await Listing.find({ category: "Room" });
  res.render("listings/index.ejs", { allListings });
};

module.exports.mountains = async (req, res) => {
  const allListings = await Listing.find({ category: "Mountains" });
  res.render("listings/index.ejs", { allListings });
};

module.exports.pools = async (req, res) => {
  const allListings = await Listing.find({ category: "Amazing Pools" });
  res.render("listings/index.ejs", { allListings });
};

module.exports.camps = async (req, res) => {
  const allListings = await Listing.find({ category: "Camping" });
  res.render("listings/index.ejs", { allListings });
};

module.exports.farms = async (req, res) => {
  const allListings = await Listing.find({ category: "Farms" });
  res.render("listings/index.ejs", { allListings });
};

module.exports.castles = async (req, res) => {
  const allListings = await Listing.find({ category: "Castles" });
  res.render("listings/index.ejs", { allListings });
};

module.exports.parks = async (req, res) => {
  const allListings = await Listing.find({ category: "Parks" });
  res.render("listings/index.ejs", { allListings });
};

module.exports.resorts = async (req, res) => {
  const allListings = await Listing.find({ category: "Resorts" });
  res.render("listings/index.ejs", { allListings });
};

module.exports.apartments = async (req, res) => {
  const allListings = await Listing.find({ category: "Apartments" });
  res.render("listings/index.ejs", { allListings });
};

module.exports.search = async (req, res) => {
  let country = req.query.country;
  if (!country) {
    req.flash("error", "Please enter a valid country name");
    res.redirect("/listings");
  }
  if (
    country === "USA" ||
    country === "US" ||
    country === "usa" ||
    country === "us"
  ) {
    country = "United States";
  } else if (
    country === "UK" ||
    country === "England" ||
    country === "uk" ||
    country === "england"
  ) {
    country = "United Kingdom";
  } else if (country === "UAE" || country === "uae") {
    country = "United Arab Emirates";
  } else {
    if (country === country.toLowerCase()) {
      country = country
        .split(" ") //splits array of elements by spaces present
        .map((name) => name.charAt(0).toUpperCase() + name.slice(1))
        .join(" ");
    }
  }

  const allListings = await Listing.find({ country: country });

  if (allListings.length === 0) {
    req.flash("error", "Don't have a registered venue from this country");
    return res.redirect("/listings");
  }

  res.render("listings/index.ejs", { allListings });
};
module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("owner");
  if (!listing) {
    req.flash("error", "Listing you searched for does not exist");
    return res.redirect("/listings");
  }
  let imageUrl = listing.image.url;
  imageUrl = imageUrl.replace("q=60", "q=60&h=600");
  // console.log(listing.owner._id);
  // console.log(req.user._id);
  res.render("listings/show.ejs", { listing, imageUrl });
};

module.exports.createNewListing = async (req, res) => {
  let response = await geocodingClient
    .forwardGeocode({
      query: req.body.listing.location,
      limit: 1,
    })
    .send();

  // const {title, description, image, price, location, country} = req.body;
  let url = req.file.path;
  let filename = req.file.filename;
  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  newListing.image = { url, filename };
  newListing.geometry = response.body.features[0].geometry;

  // console.log(req.user);
  let saveListing = await newListing.save();
  req.flash("success", "new listing added succesfully");
  res.redirect("/listings");
};

module.exports.editListingForm = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing you searched for does not exist");
    return res.redirect("/listings");
  }

  let originalImageUrl = listing.image.url;
  originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250,h_150");
  originalImageUrl = originalImageUrl.replace(
    "&w=800&q=60",
    "&w=250&h=150&q=60"
  );
  res.render("listings/edit.ejs", { listing, originalImageUrl });
};

module.exports.updateListing = async (req, res) => {
  let { id } = req.params;
  const updatedListing = await Listing.findByIdAndUpdate(id, req.body.listing);
  if (req.file) {
    let url = req.file.path;
    let filename = req.file.filename;
    updatedListing.image = { url, filename };
    await updatedListing.save();
  }
  req.flash("success", "listing edited succesfully");
  res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, res) => {
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  req.flash("success", "listing deleted succesfully");
  res.redirect("/listings");
};
