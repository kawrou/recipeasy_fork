const express = require("express");
const RecipesController = require("../controllers/recipes.js")

const router = express.Router();


router.get('/', RecipesController.index); 
router.get("/:recipe_id", RecipesController.show);
router.post("/", RecipesController.create);
router.patch("/:recipe_id", RecipesController.update);
router.patch("/:recipe_id/favourite", RecipesController.markAsFavourite);
router.get("/scrape", RecipesController.scrapeRecipeFromWebsite);

module.exports = router;
