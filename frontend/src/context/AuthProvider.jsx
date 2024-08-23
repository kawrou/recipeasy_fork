import { createContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children, initialAuth = {} }) => {
  const [auth, setAuth] = useState(initialAuth);

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
