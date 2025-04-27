const shortid = require('shortid');
const User = require("../modules/user");
const URL = require('../modules/url')



async function generateNewShortUrl(req,res) {
   const body = req.body;
   if(!body.url) return res.status(400).json({Error: 'url is required'})
    const shortID = shortid(); 
    
   await URL.create({
     shortId : shortID,
     redirectedURL: body.url,
     visitHistory:[],
     createdBy: req.user._id,
   });
     
   const allUrls = await URL.find({ createdBy: req.user._id });
      
   const loggedInUser = await User.findById(req.user._id);

   return res.render("home",{
    id:shortID,
    urls: allUrls,
    user: loggedInUser,
   });
}

 async function newShortId (req, res){
  const shortId = req.params.shortId;
  try {
      // Find the entry and update visitHistory
      const entry = await URL.findOneAndUpdate(
          { shortId },
          { 
              $push: {
                  visitHistory: { timestamp: Date.now() }
              }
          },
          { new: true }  // Ensure the updated document is returned
      );

      // Check if entry is found and redirectedURL exists
      if (entry && entry.redirectedURL) {
          return res.redirect(entry.redirectedURL);
      } else {
          
          return res.status(404).send('Short URL not found');
      }
  } catch (err) {
      return res.status(500).send('Internal Server Error');
  }
};

async function GEtAnalytics(req,res) {
   const shortId = req.params.shortId;
  const result = await URL.findOne({shortId});

  return res.json({totalClicks:result.visitHistory.length, analytics:result.visitHistory,});
}
module.exports = {
    generateNewShortUrl,
    GEtAnalytics,
    newShortId
}