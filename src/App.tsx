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
    src: url("/static/font/akzidgrostdreg.eot");
    src: url("/static/font/akzidgrostdreg.eot?#iefix")
        format("embedded-opentype"),
      url("/static/font/akzidgrostdreg.woff") format("woff"),
      url("/static/font/akzidgrostdreg.ttf") format("truetype");
    font-style: normal;
    font-weight: normal;
  }
  // Regular Italic
  @font-face {
    font-family: "Akzidenz";
    src: url("/static/font/akzidgrostdita.eot");
    src: url("/static/font/akzidgrostdita.eot?#iefix")
        format("embedded-opentype"),
      url("/static/font/akzidgrostdita.woff") format("woff"),
      url("/static/font/akzidgrostdita.ttf") format("truetype");
    font-style: italic;
    font-weight: normal;
  }
  // Bold
  @font-face {
    font-family: "Akzidenz";
    src: url("/static/font/akzidgrostdmed.eot");
    src: url("/static/font/akzidgrostdmed.eot?#iefix")
        format("embedded-opentype"),
      url("/static/font/akzidgrostdmed.woff") format("woff"),
      url("/static/font/akzidgrostdmed.ttf") format("truetype");
    font-style: normal;
    font-weight: bold;
  }
  // Bold Italic
  @font-face {
    font-family: "Akzidenz";
    src: url("/static/font/akzidgrostdmedita.eot");
    src: url("/static/font/akzidgrostdmedita.eot?#iefix")
        format("embedded-opentype"),
      url("/static/font/akzidgrostdmedita.woff") format("woff"),
      url("/static/font/akzidgrostdmedita.ttf") format("truetype");
    font-style: italic;
    font-weight: bold;
  }
  // Light
  @font-face {
    font-family: "Akzidenz";
    src: url("/static/font/akzidgrostdlig.eot");
    src: url("/static/font/akzidgrostdlig.eot?#iefix")
        format("embedded-opentype"),
      url("/static/font/akzidgrostdlig.woff") format("woff"),
      url("/static/font/akzidgrostdlig.ttf") format("truetype");
    font-style: normal;
    font-weight: 200;
  }
  // Light Italic
  @font-face {
    font-family: "Akzidenz";
    src: url("/static/font/akzidgrostdligita.eot");
    src: url("/static/font/akzidgrostdligita.eot?#iefix")
        format("embedded-opentype"),
      url("/static/font/akzidgrostdligita.woff") format("woff"),
      url("/static/font/akzidgrostdligita.ttf") format("truetype");
    font-style: italic;
    font-weight: 200;
  }
  //Condensed weights and styles
  @font-face {
    font-family: "Akzidenz Cnd";
    src: url("/static/font/akzidgrostdligcnd.eot");
    src: url("/static/font/akzidgrostdligcnd.eot?#iefix")
        format("embedded-opentype"),
      url("/static/font/akzidgrostdligcnd.woff") format("woff"),
      url("/static/font/akzidgrostdligcnd.ttf") format("truetype");
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
