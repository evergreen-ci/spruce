import * as React from "react";
import * as rest from "../rest/interface";
import { ClientConfig, IsValidConfig } from "../models/client_config";

const { createContext, useState } = React;

const configPath = "/config.json";

interface ApiClientContextType {
  apiClient: rest.Evergreen;
  actions: {
    tryLoadConfig: () => void;
    updateConfig: (configObj: ClientConfig) => void;
  };
}

const ApiClientContext = createContext<ApiClientContextType | null>(null);

const ApiClientProvider: React.FC = ({ children }) => {
  const [apiClient, setApiClient] = useState(
    rest.EvergreenClient("", "", "", "")
  );

  const contextValue: ApiClientContextType = {
    apiClient,
    actions: {
      tryLoadConfig,
      updateConfig
    }
  };

  async function updateConfig(configObj: ClientConfig) {
    setApiClient(rest.EvergreenClient(configObj.api_url, configObj.ui_url));
  }

  // the configuration of Spruce's environment is currently accomplished by requesting a config file from S3
  // that config file determines the api url and the ui url (which is just the domain)
  // TODO: use env-cmd to configure arbitrary build environments instead of using the config file
  function tryLoadConfig() {
    fetch(configPath).then((resp: Response) => {
      resp.json().then(
        (config: object) => {
          if (IsValidConfig(config)) {
            updateConfig(config as ClientConfig);
          } else {
            console.log("Config is missing required fields");
          }
        },
        (reason: any) => {
          console.log(
            "Error parsing config. You may need to manually drop a config file. Error: " +
              reason
          );
        }
      );
    });
  }

  return (
    <ApiClientContext.Provider value={contextValue as ApiClientContextType}>
      {children}
    </ApiClientContext.Provider>
  );
};

export { ApiClientProvider, ApiClientContext };
