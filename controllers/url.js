const shortid = require('shortid');

const URL = require('../modules/url')



async function handlegenerateNewShortUrl(req,res) {
   const body = req.body;
   if(!body.url) return res.status(400).json({Error: 'url is required'})
    const shortID = shortid(); 

   await URL.create({
     shortId : shortID,
     redirectedURL: body.url,
     visitHistory:[],
     createdBy: req.user._id,
   });
      
   return res.render("home",{
    id: `https://qr-urlshortner.vercel.app/${shortID}`,
   });
}

async function handleGEtAnalytics(req,res) {
   const shortId = req.params.shortId;
  const result = await URL.findOne({shortId});

  return res.json({totalClicks:result.visitHistory.length, analytics:result.visitHistory,});
}
module.exports = {
    handlegenerateNewShortUrl,
    handleGEtAnalytics,
}
