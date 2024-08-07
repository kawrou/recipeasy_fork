const express = require("express");
const RecipesController = require("../controllers/recipes.js")

const router = express.Router();

router.get("/scrape-recipe", RecipesController.fetchRecipeData);
router.get('/', RecipesController.getAllRecipesByUserId); 
router.get("/:recipe_id", RecipesController.getRecipeById);
router.post("/", RecipesController.create);
router.patch("/:recipe_id", RecipesController.updateRecipe);
router.patch("/favouritedByOwner/:recipe_id", RecipesController.isFavourite);

module.exports = router;
