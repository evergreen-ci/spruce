import * as React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Content } from "components/Content";
import { ErrorBoundary } from "components/ErrorBoundary";
import { GlobalStyles } from "components/styles/GlobalStyles";
import { routes } from "constants/routes";
import { ContextProviders } from "context/Providers";
import GQLWrapper from "gql/GQLWrapper";
import { Login } from "pages/Login";

const App: React.VFC = () => (
  <ErrorBoundary>
    <GlobalStyles />
    <ContextProviders>
      <Router>
        <GQLWrapper>
          <Routes>
            <Route path={routes.login} element={<Login />} />
            <Route path="/*" element={<Content />} />
          </Routes>
        </GQLWrapper>
      </Router>
    </ContextProviders>
  </ErrorBoundary>
);

export default App;
