const axios = require("axios");
const cheerio = require("cheerio");
const puppeteer = require("puppeteer");

const Recipe = require('../models/recipe')
const User = require('../models/user')

const fetchRecipeData = async (req, res) => {
    const url = req.query.url;
    console.log("Fetching URL:", url);

    try {
      const response = await axios.get(url);
      const html = response.data;
      console.log(response)

      const $ = cheerio.load(html);

      const jsonLD = $('script[type="application/ld+json"]');
      let recipeData;

      jsonLD.each((index, element) => {
        const scriptContent = $(element).html();
        try {
          const jsonData = JSON.parse(scriptContent);

          if (jsonData["@graph"]) {
            const recipeObjects = jsonData["@graph"].filter((obj) => obj["@type"] === "Recipe");
            recipeData = recipeObjects;
          } else if (jsonData["@type"] === "Recipe") {
            recipeData = jsonData;
          }
        } catch (error) {
          console.error("Error parsing JSON:", error);
        }
      });

      if (!recipeData || recipeData.length === 0) {
        const browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();
        await page.goto(url);

        const jsonLdData = await page.$$eval(
          'script[type="application/ld+json"]',
          (scripts) => {
            let jsonData;

            scripts.forEach((script) => {
              try {
                const parsedData = JSON.parse(script.textContent);

                if (parsedData["@graph"]) {
                  const recipeObjects = parsedData["@graph"].filter((obj) => obj["@type"] === "Recipe");
                  jsonData = recipeObjects;
                } else if (parsedData["@type"] === "Recipe") {
                  jsonData = parsedData;
                }
              } catch (error) {
                console.error("Error parsing JSON-LD data:", error);
              }
            });
            return jsonData;
          }
        );

        recipeData = jsonLdData;

        await browser.close();
      }

      console.log("Recipe Data:", recipeData);
      res.status(200).json({ recipe_data: recipeData });
    } catch (error) {
      console.log(Object.keys(error))
      // console.error("Error fetching URL:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };




const create = async (req, res) => {
  // find the user who created the recipe
  const user = await User.findById(req.user_id);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  // create recipe
  try {
    const newRecipe = new Recipe({
      name: req.body.name,
      description: req.body.description,
      ownerId: user._id,
      tags: req.body.tags,
      favouritedByOwner: req.body.favouritedByOwner,
      totalTime: req.body.totalTime,
      recipeYield: req.body.recipeYield,
      recipeIngredient: req.body.recipeIngredient,
      recipeInstructions: req.body.recipeInstructions,
      url: req.body.url,
      image: req.body.image,
      dateAdded: req.body.dateAdded
    });
    await newRecipe.save();
    console.log("New recipe created:", newRecipe._id.toString())
    res.status(201).json({ message: 'Recipe created successfully', recipe: newRecipe });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// update existing recipe entry
const updateRecipe = async (req, res) => {
  try {
    const recipeId = req.params.recipe_id;
    const user = await User.findById(req.user_id);
    if (!user) {
      console.log("user not found")
      return res.status(404).json({ message: 'User not found' });
    }
    const recipeUpdateData = { 
      name: req.body.name,
      description: req.body.description,
      ownerId: user._id,
      tags: req.body.tags,
      favouritedByOwner: req.body.favouritedByOwner,
      totalTime: req.body.totalTime,
      recipeYield: req.body.recipeYield,
      recipeIngredient: req.body.recipeIngredient,
      recipeInstructions: req.body.recipeInstructions,
      url: req.body.url,
      image: req.body.image,
      dateAdded: req.body.dateAdded
    };

    const updatedRecipe = await Recipe.findOneAndUpdate(
      { _id: recipeId, ownerId: user._id },
      { $set: recipeUpdateData },
      { new: true }
    );

    if (!updatedRecipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    res.status(200).json({ message: 'Recipe updated successfully', updatedRecipe });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const isFavourite = async (req, res) => {
  try {
    console.log('Checking if recipe is favourite...');
    
    const recipeId = req.body.recipe_id;
    console.log('Recipe ID:', recipeId);
    
    const user = await User.findById(req.user_id);
    console.log('User:', user);

    if (!user) {
      console.log('User not found');
      return res.status(404).json({ message: 'User not found' });
    }

    const recipe = await Recipe.findById(recipeId);
    console.log('Recipe:', recipe);

    if (!recipe) {
      console.log('Recipe not found');
      return res.status(404).json({ message: 'Recipe not found' });
    }

    // Toggle the favouritedByOwner field
    recipe.favouritedByOwner = !recipe.favouritedByOwner;
    console.log('Favourite status toggled:', recipe.favouritedByOwner);

    // Save the updated recipe
    await recipe.save();
    console.log('Recipe saved successfully');

    res.status(200).json({ message: 'Recipe favourited successfully', recipe });
  } catch (error) {
    console.error('Internal server error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


const RecipesController = {
  fetchRecipeData: fetchRecipeData,
  create: create,
  updateRecipe: updateRecipe,
  isFavourite: isFavourite
}

module.exports = RecipesController;