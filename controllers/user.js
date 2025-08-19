const User = require("../models/user.js");

module.exports.getSignupForm = (req, res) => {
  res.render("./users/signup.ejs");
};

module.exports.postSignup = async (req, res) => {
  try {
    let { username, email, password } = req.body;
    let firstUser = new User({ email, username });
    let registeredUser = await User.register(firstUser, password);
    // console.log(registeredUser);
    req.login(registeredUser, (err) => {
      if (err) {
        return next(err);
      } else {
        req.flash("success", "Welcome to WanderLust");
        res.redirect("/listings");
      }
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/signup");
  }
};

module.exports.getLoginForm = (req, res) => {
  res.render("./users/login.ejs");
};

module.exports.postLogin = async (req, res) => {
  req.flash("success", "Login successful");
  let redirectUrl = res.locals.saveUrl || "/listings";
  res.redirect(redirectUrl);
};

module.exports.logout = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      next(err);
    } else {
      req.flash("success", "You are logged out!");
      res.redirect("/listings");
    }
  });
};
