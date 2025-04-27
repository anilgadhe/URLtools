const express = require('express');
const router = express.Router();
const {generateNewShortUrl,GEtAnalytics,newShortId } = require('../controllers/url');


router.post('/',generateNewShortUrl);

router.get('/analytics/:shortId',GEtAnalytics);

router.get("/:shortId",newShortId)


module.exports = router;