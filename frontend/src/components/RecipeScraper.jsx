import { useNavigate } from "react-router-dom";
import { useState } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";

const RecipeScraper = ({ setRecipeData }) => {
  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();
  const [errMsg, setErrMsg] = useState("");
  const [url, setUrl] = useState("");

  const handleUrlChange = (e) => {
    setUrl(e.target.value);
    setErrMsg("");
  };

  const validateUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (err) {
      return false;
    }
  };

  const handleScrapeRecipe = async () => {
    const isValidUrl = validateUrl(url);
    // console.log(isValidUrl);
    if (!isValidUrl) {
      setErrMsg("Please enter a valid URL.");
      return;
    }

    try {
      const scrapedData = await axiosPrivate.get(
        `/recipes/scrape?url=${encodeURIComponent(url)}`,
      );
      // console.log(scrapedData.data.recipe_data.url);
      setRecipeData(scrapedData.data.recipe_data);
      setUrl("");
      navigate("/recipes/create");
    } catch (error) {
      if (error.response && error.response.status === 401) {
        navigate("/login");
      } else {
        setErrMsg(
          "There was a problem getting the recipe. Please try again or try a different URL.",
        );
      }
    }
  };

  const handleCreateRecipe = () => {
    setRecipeData(null);
    setUrl("");
    navigate("/recipes/create");
  };

  return (
    <form className="w-full pt-5" aria-label="Recipe Url Form">
      <input
        type="text"
        value={url}
        onChange={handleUrlChange}
        className="shadow-md font-poppins font-light w-full border rounded-lg py-2 px-2 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 outline-none"
        placeholder="Enter your recipe url..."
      />

      {errMsg && <p className="text-red-500">{errMsg}</p>}

      <div className="flex items-center justify-center py-5 gap-5">
        <button
          aria-label="Generate"
          onClick={async () => {
            handleScrapeRecipe(false);
          }}
          type="button"
          className="shadow-md font-kanit font-bold text-lg text-white bg-secondary-500 hover:bg-blue-900 bg- rounded-lg px-5 py-2"
        >
          Generate Recipe
        </button>
        <button
          aria-label="Manually"
          type="button"
          onClick={async () => {
            handleCreateRecipe(true);
          }}
          className="shadow-md font-kanit font-bold text-lg text-primary-500 border border-primary-500 hover:bg-primary-500 hover:text-white rounded-lg px-5 py-2"
        >
          Enter Manually
        </button>
      </div>
    </form>
  );
};

export default RecipeScraper;
