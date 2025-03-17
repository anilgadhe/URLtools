
const User = require("../modules/user");
const {setUser} = require("../service/auth");
const fs = require("fs");
const path = require("path");

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



async function handleQRCreation(req, res) {
    const url = req.body.url;

    if (!url) {
        return res.status(400).send("URL is required");
    }
   
    // Generate QR code as base64
    const qr_svg = qr.imageSync(url, { type: "png" });
    const qrBase64 = `data:image/png;base64,${qr_svg.toString("base64")}`;

    res.render("success", { url, qrBase64 });
   
    const tempURLfile = path.join("/tmp", "URL.txt");

    try {
       
        writeStream.on("finish", () => {
            
            fs.writeFile(tempURLfile, url, (err) => {
                if (err) {
                    console.error("Error saving URL:", err);
                    return res.status(500).send("Error generating QR code");
                }

                console.log("QR Code generated and URL saved.");
                res.render("success", { url });
            });
        });

    } catch (error) {
        console.error("QR code generation error:", error);
        res.status(500).send("QR code generation failed");
    }
}

module.exports = {
    handleUserSingup,
    handleUserLogin,
    handleQRCreation,
}
