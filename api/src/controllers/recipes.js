const axios = require("axios");
const cheerio = require("cheerio");
const puppeteer = require("puppeteer");
const { generateToken } = require("../lib/token");
const Recipe = require("../models/recipe");
const User = require("../models/user");
const { default: mongoose } = require("mongoose");
const { extractRecipeInfo } = require("../utils/recipeUtils");

// @desc Get all recipes
// @route GET /recipes
// @access Private
const index = async (req, res) => {
  try {
    const recipes = await Recipe.find({ ownerId: req.user_id }).exec();
    res.status(200).json({ data: recipes });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const show = async (req, res) => {
  const recipeId = req.params.recipe_id;

  if (!recipeId) {
    return res.status(400).json({message: "No recipe id"})
  }

  try {
    const recipeData = await Recipe.findById(recipeId).exec();

    if (!recipeData) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    return res
      .status(200)
      .json({ data: recipeData, user_id: req.user_id });
  }catch(err){
    if (err instanceof mongoose.Error.CastError){
      return res.status(401).json({message: "Unauthorized"});
    }

    return res.status(500).json({message: "Internal Sever Error"});
  }
};

// @desc Create new recipe
// @route POST /recipes
// @access Private
const create = async (req, res) => {
  const user = await User.findById(req.user_id);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

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
      dateAdded: req.body.dateAdded,
    });
    await newRecipe.save();

    return res.status(201).json({
      message: "Recipe created successfully",
      recipeId: newRecipe._id,
    });
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      return res.status(400).json({ message: "Missing or invalid recipe data.", errors: error.errors });
    };

    if (error.code === 11000) {
      return res.status(400).json({ message: "Duplicate key error", details: error.keyValue });
    };

    if (error instanceof mongoose.Error.CastError) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    return res.status(500).json({ message: "Internal server error" });
  }
};

// @desc Update a recipe
// @route PATCH /recipes/:recipe_id
// @access Private
const update = async (req, res) => {
  try {
    const recipeId = req.params.recipe_id;
    const user = await User.findById(req.user_id).exec();
    if (!user) {
      console.log("user not found");
      return res.status(404).json({ message: "User not found" });
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
      dateAdded: req.body.dateAdded,
    };

    const updatedRecipe = await Recipe.findOneAndUpdate(
      { _id: recipeId, ownerId: user._id },
      { $set: recipeUpdateData },
      { new: true }
    ).exec();
    if (!updatedRecipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }
    res.status(200).json({
      message: "Recipe updated successfully",
    });
  } catch (error) {
    if(err instanceof mongoose.Error.CastError){
      return res.status(401).json({message: "Unauthorized"}); 
    }
    res.status(500).json({ message: "Internal server error" });
  }
};

// @desc Mark a recipe as a favourite
// @route PATCH /recipes/:recipe_id/favourite
// @access Private
const markAsFavourite = async (req, res) => {
  try {
    const recipeId = req.params.recipe_id;

    const user = await User.findById(req.user_id);

    if (!user) {
      console.log("User not found");
      return res.status(404).json({ message: "User not found" });
    }

    const recipe = await Recipe.findById(recipeId).exec();

    if (!recipe) {
      console.log("Recipe not found");
      return res.status(404).json({ message: "Recipe not found" });
    }

    recipe.favouritedByOwner = !recipe.favouritedByOwner;

    await recipe.save();

    res.status(200).json({ message: "Recipe favourited successfully" });
  } catch (error) {
    console.error("Internal server error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// @desc Scrape a recipe from a website
// @route GET /recipe/scrape
// @access Private
//This functions runs the main feature of our web app which is scraping recipe data from websites.
const scrapeRecipeFromWebsite = async (req, res) => {
  const url = req.query.url; // assigns url to a variable
  const newToken = generateToken(req.user_id);

  try {
    // We first use axios to get webpage and return a promise
    // and then assign all webpage data to html variable
    const response = await axios.get(url);
    const html = response.data;

    //We then load the html tags into cheerio which is a library that has methods for finding and extracting html elements
    const $ = cheerio.load(html);

    //JSON-LD is being used to semantically markup the data, to make them become not only machine-readable,
    //but also machine-understanable by providing additional syntax to JSON for serialization of Linked Data.
    const jsonLD = $('script[type="application/ld+json"]');
    let recipeData;

    //jsonLD is a collection of HTML elements
    //each method from the cheerio library, takes a callback func with two parameters -

    //index of the current element, and 'element' is reference to the current 'element'

    //You can access and manipulate the element using the 'element' parameter
    //console.log(`Element ${index}: ${element.html()}`); -> prints the html element and index to the console
    jsonLD.each((index, element) => {
      const scriptContent = $(element).html(); // Gets the html elements and assign it to a variable
      try {
        const jsonData = JSON.parse(scriptContent); //Turns the html elements into a JSON object with key/value pairs
        if (jsonData["@graph"]) {
          const recipeObjects = jsonData["@graph"].filter(
            (obj) => obj["@type"] === "Recipe"
          );
          recipeData = recipeObjects[0];
        } else if (jsonData["@type"] === "Recipe") {
          recipeData = jsonData;
        }
      } catch (error) {
        console.error("Error parsing JSON:", error);
      }
    });

    // Failsafe - If axios and cheerio doesn't work, use puppeteer
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
                const recipeObjects = parsedData["@graph"].filter(
                  (obj) => obj["@type"] === "Recipe"
                );
                jsonData = recipeObjects[0];
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

    //Once the recipe data has been scraped, we send it to the 'extractRecipeInfo' module to filter out only the data we need.
    const filteredRecipeData = extractRecipeInfo(recipeData);
    filteredRecipeData.recipeUrl = url;
    res.status(200).json({ recipe_data: filteredRecipeData, token: newToken });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const RecipesController = {
  index,
  show,
  create,
  update,
  markAsFavourite,
  scrapeRecipeFromWebsite,
};

module.exports = RecipesController;
