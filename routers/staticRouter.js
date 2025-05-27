const express = require("express");
const router = express.Router();
const User = require("../modules/user");
const URL = require("../modules/url");
const { restrictToLoggedinUserOnly, checkAuth } = require("../middlewares/auth");


router.get('/',checkAuth, async (req, res) => {
  try {
      if(!req.user){
        
        res.render("home",{ user: null, urls: [] ,cookies: req.cookies });
      }else{
     
      const allUrls = await URL.find({ createdBy: req.user._id });
      
      const loggedInUser = await User.findById(req.user._id);

      return res.render('home', {
          urls: allUrls, 
          
          user: loggedInUser,
      });
    } 
  } catch (error) {
      console.error("Error fetching URLs:", error);
      return res.status(500).send("Internal Server Error");
  }
});


module.exports = router;