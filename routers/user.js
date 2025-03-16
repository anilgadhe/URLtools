const express = require("express");
const {handleUserSingup,handleUserLogin, handleQRCreation} = require("../controllers/user")

const router = express.Router();

router.post("/",handleUserSingup);


router.post("/Login",handleUserLogin);

router.post("/generate-qr",handleQRCreation);


router.get("/logout",(req,res)=>{
    res.clearCookie("uid").redirect("/");
})

module.exports = router;