import * as React from "react";
import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from "react-router-dom";
import { Content } from "components/Content";
import { ErrorBoundary } from "components/ErrorHandling";
import { GlobalStyles } from "components/styles/GlobalStyles";
import { routes } from "constants/routes";
import { ContextProviders } from "context/Providers";
import GQLWrapper from "gql/GQLWrapper";
import { Login } from "pages/Login";

const browserRouter = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path={routes.login} element={<Login />} />
      <Route
        path="/*"
        element={
          <GQLWrapper>
            <Content />
          </GQLWrapper>
        }
      />
    </>,
  ),
);

const App: React.FC = () => (
  <ErrorBoundary>
    <GlobalStyles />
    <ContextProviders>
      <RouterProvider router={browserRouter} />
    </ContextProviders>
  </ErrorBoundary>
);

export default App;
