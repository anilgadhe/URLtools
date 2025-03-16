const express = require('express');
const {handlegenerateNewShortUrl,handleGEtAnalytics} = require('../controllers/url');
const router = express.Router();

router.post('/',handlegenerateNewShortUrl);

router.get('/analytics/:shortId',handleGEtAnalytics)


module.exports = router;