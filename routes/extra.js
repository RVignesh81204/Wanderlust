const express = require("express");
const router = express.Router();
const extraController = require("../controllers/extras.js");

router.get("/privacy", extraController.privacy);
router.get("/terms", extraController.terms);

module.exports = router;
