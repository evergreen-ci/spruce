import * as React from "react";
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

// Temporary ErrorBoundary to use before bugsnag API key is accessed via environment variables
// TODO: delete this ErrorBoundary and replace with bugsnag ErrorBoundary
class ErrorBoundary extends React.Component<{}, { hasError: boolean }> {
  public static getDerivedStateFromError() {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  private constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  public render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return <h1>Something went wrong.</h1>;
    }

    return this.props.children;
  }
}

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
