import bugsnag from "@bugsnag/js";
import bugsnagReact from "@bugsnag/plugin-react";

// Bugsnag docs recommend instantiating the BugsnagClient as soon as possible and before the rest of the module's imports
const bugsnagClient = bugsnag({
  apiKey: "2d77ffd5445ab337cd3c996a2400438a",
  notifyReleaseStages: ["production"]
});
bugsnagClient.use(bugsnagReact, React);

import { createMuiTheme } from "@material-ui/core";
import { ThemeProvider } from "@material-ui/styles";
import * as React from "react";
import { HashRouter, Route } from "react-router-dom";
import { ContextProvider } from "../../context/ContextProvider";
import { ApiClientContext } from "../../context/apiClient";
import { UserContext } from "../../context/user";
import "../../styles.css";
import { Admin } from "../admin/Admin";
import { BuildView } from "../build/BuildView";
import ConfigDrop from "../configdrop/ConfigDrop";
import { PatchContainer } from "../patch/PatchContainer";
import { Navbar } from "../Navbar";

const { useContext } = React;
const ErrorBoundary = bugsnagClient.getPlugin("react");

const theme = createMuiTheme({
  typography: {
    fontFamily: [
      "Akzidenz",
      "Helvetica Neue",
      "Helvetica",
      "Arial",
      "sans-serif"
    ].join(","),
    fontSize: 14
  },
  overrides: {
    MuiAppBar: {
      colorPrimary: {
        backgroundColor: "#3E4347",
        boxShadow: "none"
      }
    }
  }
});

// These wrapper components are temporary components to pass their children the value of contexts using the useContext hook
// TODO: refactor Admin, ConfigDrop, PatchContainer and BuildView to be functional components that consume their respective contexts
const AdminWrapper = () => {
  const { apiClient } = useContext(ApiClientContext);
  return <Admin APIClient={apiClient} />;
};
const Config = () => {
  const {
    actions: { updateConfig }
  } = useContext(ApiClientContext);
  return <ConfigDrop updateClientConfig={updateConfig} onLoadFinished={null} />;
};
const Patches = () => {
  const { username } = useContext(UserContext);
  const { apiClient } = useContext(ApiClientContext);
  return (
    <PatchContainer
      client={apiClient}
      username={username}
      onFinishStateUpdate={null}
    />
  );
};
const Build = () => {
  const { apiClient } = useContext(ApiClientContext);
  return <BuildView client={apiClient} />;
};

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <ContextProvider>
        <ThemeProvider theme={theme}>
          <div className="app">
            <HashRouter>
              <Navbar />
              <div className="app-intro">
                <Route path="/admin">
                  <AdminWrapper />
                </Route>
                <Route path="/config">
                  <Config />
                </Route>
                <Route path="/patches">
                  <Patches />
                </Route>
                <Route path="/build">
                  <Build />
                </Route>
              </div>
            </HashRouter>
          </div>
        </ThemeProvider>
      </ContextProvider>
    </ErrorBoundary>
  );
};

export default App;
