const express = require("express");
const router = express.Router();
const loginLimiter = require("../middleware/loginLimiter")
const AuthenticationController = require("../controllers/authentication");
const tokenChecker = require("../middleware/tokenChecker");

router.post("/", loginLimiter, AuthenticationController.createToken);
router.post("/refresh", AuthenticationController.refresh); 
router.post("/logout", AuthenticationController.logOut); 

//TODO:I THINK UNECESSARY. Only used by RecipeScraper on frontend. But the route is already checked by a token checker!
router.get("/", tokenChecker, AuthenticationController.checkToken);

module.exports = router;
