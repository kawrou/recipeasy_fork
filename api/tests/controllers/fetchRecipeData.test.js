const axios = require("axios");
const puppeteer = require("puppeteer");

const RecipesController = require("../../src/controllers/recipes");

// const app = require("../../app");

jest.mock("axios");
jest.mock("puppeteer");

// require("../mongodb_helper");

// const secret = process.env.JWT_SECRET;

// let token;

describe("RecipesController", () => {
  it("should fetch recipe data successfully", async () => {
    const mockAxiosResponse = {
      data:
        "<html><body><script type='application/ld+json'>{" +
        '"@context": "http://schema.org",' +
        '"@type": "Recipe",' +
        '"recipeIngredient": ["1 cup flour", "2 eggs"],' +
        '"recipeInstructions": ["Mix the ingredients.", "Bake for 20 minutes."]' +
        "}</script></body></html>",
    };

    axios.get.mockResolvedValueOnce(mockAxiosResponse);
    
    puppeteer.launch.mockResolvedValueOnce({
      newPage: jest.fn().mockResolvedValueOnce({
        goto: jest.fn().mockResolvedValueOnce(),
        $$eval: jest
          .fn()
          .mockImplementation((selector, callback) => callback([])),
      }),
      close: jest.fn().mockResolvedValueOnce(),
    });

    const req = { query: { url: "https://example.com" } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    await RecipesController.scrapeRecipeFromWebsite(req, res);

    expect(axios.get).toHaveBeenCalledWith("https://example.com");
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        recipe_data: expect.any(Object),
        token: expect.any(String),
      })
    );
  });

  it("should handle network failure", async () => {
    axios.get.mockRejectedValueOnce(new Error("Network error"));

    const req = { query: { url: "https://example.com" } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    await RecipesController.scrapeRecipeFromWebsite(req, res);

    expect(axios.get).toHaveBeenCalledWith("https://example.com");
    expect(res.status).toHaveBeenCalledWith(500);
  });
});
