import * as React from "react";
import bugsnag from "@bugsnag/js";
import bugsnagReact from "@bugsnag/plugin-react";
import { createMuiTheme } from "@material-ui/core";
import { ThemeProvider } from "@material-ui/styles";
import { HashRouter, Route } from "react-router-dom";
import { ContextProvider } from "../../context/ContextProvider";
import { ApiClientContext } from "../../context/apiClient";
import { UserContext } from "../../context/user";
import "../../styles.css";
import { BuildView } from "../build/BuildView";
import { PatchContainer } from "../patch/PatchContainer";
import { Navbar } from "../Navbar";

const { useContext } = React;

const bugsnagClient = bugsnag(process.env.REACT_APP_BUGSNAG_API_KEY);
bugsnagClient.use(bugsnagReact, React);
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
// TODO: refactor PatchContainer and BuildView to be functional components that consume their respective contexts
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
