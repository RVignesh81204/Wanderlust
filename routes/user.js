const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveredirectUrl } = require("../middleware.js");
const userController = require("../controllers/user.js");

//SIGNUP
router
  .route("/signup")
  .get(userController.getSignupForm)
  .post(wrapAsync(userController.postSignup));

//LOGIN - passport.authenticate method triggers req.user. Hence the user is serialized into the session
router
  .route("/login")
  .get(userController.getLoginForm)
  .post(
    saveredirectUrl,
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
    }),
    userController.postLogin
  );

//LOGOUT --> Deserializes user from the session

router.get("/logout", userController.logout);

module.exports = router;
