import * as React from "react";

const { useState } = React;

interface UserContextValue {
  username: string;
  actions: {
    setUsername: (username: string) => void;
  };
}

const UserContext = React.createContext({} as UserContextValue);

const UserContextProvider: React.FC = ({ children }) => {
  const [username, setUsername] = useState("");

  function handleSetUsername(newUsername: string) {
    setUsername(newUsername);
  }

  const contextValue: UserContextValue = {
    username,
    actions: {
      setUsername: handleSetUsername
    }
  };

  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
};

export { UserContext, UserContextProvider };
