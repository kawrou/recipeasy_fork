import { createContext, useState } from "react";

const AuthContext = createContext({});

export const AuthProvider = ({ children, initialAuth = {} }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(initialAuth);

  return (
    <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
