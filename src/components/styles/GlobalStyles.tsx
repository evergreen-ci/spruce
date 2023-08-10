import { Global, css } from "@emotion/react";
import { fontFamilies } from "@leafygreen-ui/tokens";
import fontStyles from "components/styles/fonts";

export const resetStyles = css`
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
    font-family: ${fontFamilies.code};
    line-height: 1.5;
    margin: 0;
  }
`;

export const overrideStyles = css`
  background-color: white;

  body {
    font-family: ${fontFamilies.default};
    font-size: 13px;
    margin: 0;
    -webkit-font-smoothing: antialiased; /* Chrome, Safari */
    -moz-osx-font-smoothing: grayscale; /* Firefox */
  }

  // TODO: Remove when fixed: https://jira.mongodb.org/browse/EVG-18184
  // Override LeafyGreen's 'display: inherit' rule.
  code {
    display: inline !important;
    line-height: inherit !important;
  }
`;

const spruceGlobalStyles = css`
  ${fontStyles}
  ${resetStyles}
  ${overrideStyles}
`;

export const GlobalStyles = () => <Global styles={spruceGlobalStyles} />;
