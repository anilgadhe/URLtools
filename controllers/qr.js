const fs = require("fs");
const qr = require("qr-image");
const User = require("../modules/user");

async function handleQRCreation(req,res){
    const url = req.body.url;
 
   if (!url) {
     return res.status(400).send("URL is required");  
   }
   const loggedInUser = await User.findById(req.user._id);
   const qr_svg = qr.image(url, { type: "png" });
   qr_svg.pipe(fs.createWriteStream("./public/qr_image.png"));
 
   // Save the URL to a text file
   fs.writeFile("URL.txt", url, (err) => {
     if (err) {
       console.error("Error saving URL to file:", err);
       return res.status(500).send("Error generating QR code");
     }
     res.render("success", { url,
      user:loggedInUser, 
      }); 
   });
 }

 module.exports={
    handleQRCreation
 }