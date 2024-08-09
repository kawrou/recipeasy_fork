const express = require("express");
const router = express.Router();

const AuthenticationController = require("../controllers/authentication");
const tokenChecker = require("../middleware/tokenChecker");

router.post("/", AuthenticationController.createToken);
router.get("/refresh", AuthenticationController.refreshToken); 
router.post("/logout", AuthenticationController.logout); 

//TODO:I THINK UNECESSARY. Only used by RecipeScraper on frontend. But the route is already checked by a token checker!
router.get("/", tokenChecker, AuthenticationController.checkToken);

module.exports = router;
