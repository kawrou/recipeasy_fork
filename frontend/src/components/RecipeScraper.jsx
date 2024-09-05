import { useNavigate } from "react-router-dom";
import useAxiosPrivate from "../hooks/useAxiosPrivate";

const RecipeScraper = ({ url, setUrl, handleUrlChange, setRecipeData }) => {
  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();

  const handleClick = async (manually) => {
    try {
      if (!manually) {
        if (url === "") {
          console.error("Please input url to scrape recipe");
          return;
        }

        const scrapedData = await axiosPrivate.get(
          `/recipes/scrape?url=${encodeURIComponent(url)}`,
        );
        setRecipeData(scrapedData.data.recipe_data);
      } else {
        setRecipeData(undefined);
        setUrl(undefined);
      }
      navigate("/recipes/create");
    } catch (error) {
      if (error.response && error.response.status === 401) {
        navigate("/login");
      } else {
        console.error(error);
      }
    }
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
      <div className="flex items-center justify-center py-5 gap-5">
        <button
          aria-label="Generate"
          onClick={async () => {
            handleClick(false);
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
            handleClick(true);
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
