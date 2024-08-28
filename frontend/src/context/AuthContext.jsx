import { createContext, useState, useEffect } from "react";
import { authStore } from "../api/authStore";

const AuthContext = createContext({});

export const AuthProvider = ({
  children,
  initialAuth = !!authStore.getAccessToken(),
}) => {
  const [isLoggedIn, setIsLoggedIn] = useState(initialAuth);

  useEffect(() => {
    const handleAuthChange = (isAuthenticated) => {
      setIsLoggedIn(isAuthenticated);
    };

    authStore.subscribe(handleAuthChange);

    return () => {
      authStore.unsubscribe(handleAuthChange);
    };
  }, []);

  return (
    <AuthContext.Provider value={{ isLoggedIn }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
