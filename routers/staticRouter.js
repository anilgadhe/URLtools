const express = require("express");
const router = express.Router();
const path = require("path");
const User = require("../modules/user");
const URL = require("../modules/url")
const {restrictToLoggedinUserOnly } = require("../middlewares/auth")

router.get('/',restrictToLoggedinUserOnly, async (req, res) => {
  try {
      
      if (!req.user) return res.redirect('/login');

      // Fetch URLs created by the user
      const allUrls = await URL.find({ createdBy: req.user._id });
      
      const loggedInUser = await User.findById(req.user._id);

      
      // Render home page with URLs
      return res.render('home', {
          urls: allUrls, 
           // Pass URLs & users  to the view
             user: loggedInUser,
      });
  } catch (error) {
      console.error("Error fetching URLs:", error);
      return res.status(500).send("Internal Server Error");
  }
});




router.get("/signup", (req, res) => {
  res.render("signup"); 
});

router.get("/login", (req, res) => {
  res.render("login"); 
});



module.exports = router;