const express = require("express");
const router = express.Router();
const {handleUserSingup,handleUserLogin,getLogin,getSignup} = require("../controllers/user")

function redirectIfLoggedIn(req, res, next) {
    if (req.user) return res.redirect('/');
    next();
}

router.get("/login",redirectIfLoggedIn, getLogin);
router.post("/login", handleUserLogin);

router.get("/signup", redirectIfLoggedIn, getSignup);
router.post("/signup", handleUserSingup);

router.get("/logout", (req, res) => {
    res.clearCookie("uid").redirect("/login");
});

module.exports = router;