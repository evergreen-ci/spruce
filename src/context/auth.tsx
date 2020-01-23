import React, { useContext } from "react";

const AuthContext = React.createContext(false);

export const useAuthContext = () => {
  const auth = useContext(AuthContext);
  if (auth === undefined) {
    throw new Error("AuthContext must be used within an auth context provider");
  }
  return auth;
};
