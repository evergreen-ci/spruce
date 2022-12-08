import { Global, css } from "@emotion/react";
import fontStyles from "components/styles/fonts";

const resetStyles = css`
  html {
    box-sizing: border-box;
  }

  *,
  *:before,
  *:after {
    box-sizing: inherit;
  }

  a {
    text-decoration: none;
  }

  fieldset {
    border: 0;
    margin: 0;
    padding: 0;
  }

  pre {
    font-family: "Source Code Pro", Menlo, monospace;
    line-height: 1.5;
    margin: 0;
  }
`;

const globalStyles = css`
  ${fontStyles}
  ${resetStyles}

  background-color: white;

  body {
    font-family: "Euclid Circular A", "Helvetica Neue", sans-serif;
    font-size: 13px;
    margin: 0;
  }
`;

export const GlobalStyles = () => <Global styles={globalStyles} />;
