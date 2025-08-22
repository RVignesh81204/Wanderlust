const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { authenticateUser, isOwner, handleErr } = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const multer = require("multer"); //parses the uploaded file data (multipart/form-data)
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage }); //destination for the file to be saved

//INDEX ROUTE && // CREATE ROUTE
// This route handles both the index of listings and the creation of a new listing

router
  .route("/")
  .get(wrapAsync(listingController.index))
  .post(
    authenticateUser,
    upload.single("listing[image]"),
    handleErr,
    wrapAsync(listingController.createNewListing)
  );

//NEW ROUTE
router.get("/new", authenticateUser, listingController.renderNewForm);

//ICONS

router.get("/trending", wrapAsync(listingController.trending));
router.get("/room", wrapAsync(listingController.room));
router.get("/mountains", wrapAsync(listingController.mountains));
router.get("/pools", wrapAsync(listingController.pools));
router.get("/camps", wrapAsync(listingController.camps));
router.get("/farms", wrapAsync(listingController.farms));
router.get("/castles", wrapAsync(listingController.castles));
router.get("/parks", wrapAsync(listingController.parks));
router.get("/resorts", wrapAsync(listingController.resorts));
router.get("/apartments", wrapAsync(listingController.apartments));

//search listings by country
router.get("/search", wrapAsync(listingController.search));
//SHOW ROUTE && // UPDATE ROUTE && // DELETE ROUTE
router
  .route("/:id")
  .get(wrapAsync(listingController.showListing))
  .put(
    authenticateUser,
    isOwner,
    upload.single("listing[image]"),
    handleErr,
    wrapAsync(listingController.updateListing)
  )
  .delete(
    authenticateUser,
    isOwner,
    wrapAsync(listingController.destroyListing)
  );

//EDIT ROUTE
router.get(
  "/:id/edit",
  authenticateUser,
  wrapAsync(listingController.editListingForm)
);

module.exports = router;
