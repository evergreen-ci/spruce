import * as React from "react";
import bugsnag from "@bugsnag/js";
import bugsnagReact from "@bugsnag/plugin-react";
import { createMuiTheme } from "@material-ui/core";
import { ThemeProvider } from "@material-ui/styles";
import { HashRouter, Route, RouteComponentProps } from "react-router-dom";
import { ContextProvider } from "../../context/ContextProvider";
import { ApiClientContext } from "../../context/apiClient";
import { UserContext } from "../../context/user";
import "../../styles.css";
import { BuildView } from "../build/BuildView";
import { PatchContainer } from "../patch/PatchContainer";
import { Navbar } from "../Navbar";
import { getBugsnagApiKey } from "../../utils";
import { PatchRouteParams } from "../../types";
import GQLWrapper from "../../gql/GQLWrapper";
import {
  getGQLUrl,
  getSchemaString,
  isDevelopment,
  isTest,
  shouldEnableGQLMockServer
} from "../../utils";
const { useContext } = React;

const bugsnagClient = bugsnag(getBugsnagApiKey());
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
const Patches = (props: RouteComponentProps<PatchRouteParams>) => {
  const { params } = props.match;
  const { username } = useContext(UserContext);
  const { apiClient } = useContext(ApiClientContext);
  return (
    <PatchContainer
      client={apiClient}
      username={username}
      onFinishStateUpdate={null}
      params={params}
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
      <GQLWrapper
        gqlURL={getGQLUrl()}
        isDevelopment={isDevelopment()}
        isTest={isTest()}
        schemaString={getSchemaString()}
        credentials={isDevelopment() || isTest() ? "" : "include"}
        shouldEnableGQLMockServer={shouldEnableGQLMockServer()}
      >
        <ContextProvider>
          <ThemeProvider theme={theme}>
            <div className="app">
              <HashRouter>
                <Navbar />
                <div className="app-intro">
                  <Route
                    path="/patches/:pageType?/:owner?"
                    component={Patches}
                  />
                  <Route path="/build">
                    <Build />
                  </Route>
                </div>
              </HashRouter>
            </div>
          </ThemeProvider>
        </ContextProvider>
      </GQLWrapper>
    </ErrorBoundary>
  );
};

export default App;
