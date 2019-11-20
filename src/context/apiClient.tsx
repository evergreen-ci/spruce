import * as React from "react";
import * as rest from "../rest/interface";

const { createContext, useState } = React;

interface ApiClientContextType {
  apiClient: rest.Evergreen;
  actions: {
    updateConfig: (username: string, key?: string) => void;
  };
}

const ApiClientContext = createContext<ApiClientContextType | null>(null);

const ApiClientProvider: React.FC = ({ children }) => {
  const [apiClient, setApiClient] = useState(rest.EvergreenClient());

  const updateConfig = (username: string, key?: string) => {
    setApiClient(rest.EvergreenClient({ username, key }));
  };

  const contextValue: ApiClientContextType = {
    apiClient,
    actions: {
      updateConfig
    }
  };

  return (
    <ApiClientContext.Provider value={contextValue as ApiClientContextType}>
      {children}
    </ApiClientContext.Provider>
  );
};

export { ApiClientProvider, ApiClientContext };
