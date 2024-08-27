import { useState, useCallback } from "react";
import { axiosPrivate } from "../api/axios";

export const useFetchRecipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState({});

  const fetchRecipes = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axiosPrivate.get("/recipes");
      setRecipes(response.data.recipes);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      if (!err?.response) {
        setError({
          type: "no-server-response",
          message:
            "No Server Response. Please check your internet connection or try again later.",
        });
        return;
      }
      if (err?.response.status === 401 || err?.response.status === 403) {
        setError({
          type: "auth-error",
          message: "Unauthorized access. Please log in again.",
        });
        return;
      }
      setError({
        type: "unexpected-error",
        message: "An unexpected error occurred.",
      });
    }
  }, []);

  return { recipes, loading, error, fetchRecipes };
};
