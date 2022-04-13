import * as React from "react";
import { Global, css } from "@emotion/react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { Content } from "components/Content";
import { ErrorBoundary } from "components/ErrorBoundary";
import { akzidenzFont } from "components/styles/Fonts";
import { routes } from "constants/routes";
import { ContextProviders } from "context/Providers";
import GQLWrapper from "gql/GQLWrapper";
import { Login } from "pages/Login";

const globalStyles = css`
  ${akzidenzFont}
  background-color: white;
  background: white;
  body {
    font-family: "Akzidenz", "Helvetica Neue", sans-serif;
  }
`;

const App: React.VFC = () => (
  <ErrorBoundary>
    <ContextProviders>
      <Router>
        <Route path={routes.login} component={Login} />
        <GQLWrapper>
          <Global styles={globalStyles} />
          <Content />
        </GQLWrapper>
      </Router>
    </ContextProviders>
  </ErrorBoundary>
);

export default App;
