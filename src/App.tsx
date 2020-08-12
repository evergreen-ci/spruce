import * as React from "react";
import { Global, css } from "@emotion/core";
import { ApolloClientProvider } from "gql/ApolloClientProvider";
import { BrowserRouter as Router } from "react-router-dom";
import { ErrorBoundary } from "components/ErrorBoundary";
import { Content } from "components/Content";
import { ContextProviders } from "context/Providers";

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

const App: React.FC = () => (
  <ErrorBoundary>
    <ContextProviders>
      <Router>
        <ApolloClientProvider>
          <Global
            styles={css`
              background-color: white;
              background: white;
            `}
          />
          <Content />
        </ApolloClientProvider>
      </Router>
    </ContextProviders>
  </ErrorBoundary>
);

export default App;
