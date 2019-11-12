import * as React from "react";
import bugsnag, { Bugsnag } from "@bugsnag/js";
import bugsnagReact from "@bugsnag/plugin-react";
import * as rest from "../rest/interface";
import * as models from "evergreen.js/lib/models";
import { AxiosResponse } from "axios";
import { ClientConfig, IsValidConfig } from "../models/client_config";

const { createContext, useState } = React;

const configPath = "/config.json";

const UserContext = createContext({});

type ApiClientContext = {
  apiClient: rest.Evergreen;
  actions: {
    tryLoadConfig: () => void;
    updateConfig: (configObj: ClientConfig) => void;
  };
};

const ApiClientProvider: React.FC = ({ children }) => {
  const [bugsnag, setBugsnag] = useState(null);
  const [apiClient, setApiClient] = useState(
    rest.EvergreenClient("", "", "", "")
  );

  const contextValue: ApiClientContext = {
    apiClient,
    actions: {
      tryLoadConfig,
      updateConfig
    }
  };

  function updateConfig(configObj: ClientConfig) {
    setApiClient(rest.EvergreenClient(configObj.api_url, configObj.ui_url));
    apiClient.getAdminConfig().then((resp: AxiosResponse<any>) => {
      let bugsnagClient: Bugsnag.Client;
      if (resp.data) {
        const settings = models.ConvertToAdminSettings(resp.data);
        if (settings.bugsnag) {
          bugsnagClient = bugsnag(settings.bugsnag);
          bugsnagClient.use(bugsnagReact, React);
        }
        setBugsnag(bugsnagClient);
      }
    });
  }

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
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
};

export { ApiClientProvider, ApiClientContext };
