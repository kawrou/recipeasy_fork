import { useState, useCallback } from "react";
import useAxiosPrivate from "./useAxiosPrivate";

export const useFetchRecipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const axiosPrivate = useAxiosPrivate();

  const fetchRecipes = useCallback(async () => {

    setLoading(true);

    try {
      const response = await axiosPrivate.get("/recipes");
      setRecipes(response.data.recipes);
      setLoading(false);
    } catch (err) {
      if (!err?.response) {
        setError("No Server Response");
      }
      setLoading(false);
      setError(true);
    }
  }, [axiosPrivate]);

  return { recipes, loading, error, fetchRecipes };
};
