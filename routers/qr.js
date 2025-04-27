const express = require('express');
const router = express.Router();
const {handleQRCreation}=require("../controllers/qr")


router.post("/qrcode",  handleQRCreation);


module.exports  = router;