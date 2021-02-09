import * as React from "react";
import { Global, css } from "@emotion/react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { Content } from "components/Content";
import { ErrorBoundary } from "components/ErrorBoundary";
import { routes } from "constants/routes";
import { ContextProviders } from "context/Providers";
import GQLWrapper from "gql/GQLWrapper";

// ANTD css
import "antd/es/breadcrumb/style/css";
import "antd/es/carousel/style/css";
import "antd/es/divider/style/css";
import "antd/es/icon/style/css";
import "antd/es/input-number/style/css";
import "antd/es/input/style/css";
import "antd/es/layout/style/css";
import "antd/es/message/style/css";
import "antd/es/modal/style/css";
import "antd/es/pagination/style/css";
import "antd/es/popconfirm/style/css";
import "antd/es/radio/style/css";
import "antd/es/select/style/css";
import "antd/es/skeleton/style/css";
import "antd/es/spin/style/css";
import "antd/es/table/style/css";
import "antd/es/collapse/style/css";
import "antd/es/date-picker/style/css";
import "antd/es/time-picker/style/css";
import { Login } from "pages/Login";

const App: React.FC = () => (
  <ErrorBoundary>
    <ContextProviders>
      <Router>
        <Route path={routes.login} component={Login} />
        <GQLWrapper>
          <Global
            styles={css`
              background-color: white;
              background: white;
            `}
          />
          <Content />
        </GQLWrapper>
      </Router>
    </ContextProviders>
  </ErrorBoundary>
);

export default App;
