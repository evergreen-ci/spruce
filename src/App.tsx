import * as React from "react";
import { Global, css } from "@emotion/react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { Content } from "components/Content";
import { ErrorBoundary } from "components/ErrorBoundary";
import { routes } from "constants/routes";
import { ContextProviders } from "context/Providers";
import GQLWrapper from "gql/GQLWrapper";
import { Login } from "pages/Login";

const globalStyles = css`
  // Regular
  @font-face {
    font-family: "Akzidenz";
    src: url("/static/font/akzidenz/akzidgrostdreg.eot");
    src: url("/static/font/akzidenz/akzidgrostdreg.eot?#iefix")
        format("embedded-opentype"),
      url("/static/font/akzidenz/akzidgrostdreg.woff") format("woff"),
      url("/static/font/akzidenz/akzidgrostdreg.ttf") format("truetype");
    font-style: normal;
    font-weight: normal;
  }
  // Regular Italic
  @font-face {
    font-family: "Akzidenz";
    src: url("/static/font/akzidenz/akzidgrostdita.eot");
    src: url("/static/font/akzidenz/akzidgrostdita.eot?#iefix")
        format("embedded-opentype"),
      url("/static/font/akzidenz/akzidgrostdita.woff") format("woff"),
      url("/static/font/akzidenz/akzidgrostdita.ttf") format("truetype");
    font-style: italic;
    font-weight: normal;
  }
  // Bold
  @font-face {
    font-family: "Akzidenz";
    src: url("/static/font/akzidenz/akzidgrostdmed.eot");
    src: url("/static/font/akzidenz/akzidgrostdmed.eot?#iefix")
        format("embedded-opentype"),
      url("/static/font/akzidenz/akzidgrostdmed.woff") format("woff"),
      url("/static/font/akzidenz/akzidgrostdmed.ttf") format("truetype");
    font-style: normal;
    font-weight: bold;
  }
  // Bold Italic
  @font-face {
    font-family: "Akzidenz";
    src: url("/static/font/akzidenz/akzidgrostdmedita.eot");
    src: url("/static/font/akzidenz/akzidgrostdmedita.eot?#iefix")
        format("embedded-opentype"),
      url("/static/font/akzidenz/akzidgrostdmedita.woff") format("woff"),
      url("/static/font/akzidenz/akzidgrostdmedita.ttf") format("truetype");
    font-style: italic;
    font-weight: bold;
  }
  // Light
  @font-face {
    font-family: "Akzidenz";
    src: url("/static/font/akzidenz/akzidgrostdlig.eot");
    src: url("/static/font/akzidenz/akzidgrostdlig.eot?#iefix")
        format("embedded-opentype"),
      url("/static/font/akzidenz/akzidgrostdlig.woff") format("woff"),
      url("/static/font/akzidenz/akzidgrostdlig.ttf") format("truetype");
    font-style: normal;
    font-weight: 200;
  }
  // Light Italic
  @font-face {
    font-family: "Akzidenz";
    src: url("/static/font/akzidenz/akzidgrostdligita.eot");
    src: url("/static/font/akzidenz/akzidgrostdligita.eot?#iefix")
        format("embedded-opentype"),
      url("/static/font/akzidenz/akzidgrostdligita.woff") format("woff"),
      url("/static/font/akzidenz/akzidgrostdligita.ttf") format("truetype");
    font-style: italic;
    font-weight: 200;
  }
  //Condensed weights and styles
  @font-face {
    font-family: "Akzidenz Cnd";
    src: url("/static/font/akzidenz/akzidgrostdligcnd.eot");
    src: url("/static/font/akzidenz/akzidgrostdligcnd.eot?#iefix")
        format("embedded-opentype"),
      url("/static/font/akzidenz/akzidgrostdligcnd.woff") format("woff"),
      url("/static/font/akzidenz/akzidgrostdligcnd.ttf") format("truetype");
    font-style: normal;
    font-weight: 200;
  }
  background-color: white;
  background: white;
  body {
    font-family: "Akzidenz", "Helvetica Neue", sans serif;
  }
`;

const App: React.FC = () => (
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
