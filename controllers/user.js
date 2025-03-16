
const User = require("../modules/user");
const {setUser} = require("../service/auth");
const fs = require("fs");
const qr = require("qr-image");



async function handleUserSingup( req, res){
   const {name , email , password} = req.body ;
   await User.create({
    name,
    email,
    password
   });
   return res.render("login");


}

async function handleUserLogin( req, res){
    const { email , password} = req.body ;
   try {  
     const user = await User.matchPassword(email, password);
     

     const token =setUser( user);
     
    

     res.cookie("uid", token);

     const loggedInUser = await User.findById(req.user._id);

    return res.render("home",{
      user:loggedInUser,
    });
   } catch (error) {
    return res.render("login",{
      error:"incorrect Email or password",
    })
   }
 }



 async function handleQRCreation(req,res){
     const url = req.body.url;
  
    if (!url) {
      return res.status(400).send("URL is required");
    }
  
    const qr_svg = qr.image(url, { type: "png" });
    qr_svg.pipe(fs.createWriteStream("./public/qr_image.png"));
  
    // Save the URL to a text file
    fs.writeFile("URL.txt", url, (err) => {
      if (err) {
        console.error("Error saving URL to file:", err);
        return res.status(500).send("Error generating QR code");
      }
  
      console.log("QR code generated and saved as qr_image.png");
      res.render("success", { url }); 
    });
  }

module.exports = {
    handleUserSingup,
    handleUserLogin,
    handleQRCreation,
}