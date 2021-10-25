import { css } from "@emotion/react";

// Akzidenz Light
const akzidenzLight = css`
  @font-face {
    font-display: swap;
    font-family: "Akzidenz";
    font-weight: 200;
    font-style: normal;
    src: url("/static/font/akzidenz/akzidgrostdlig-webfont.woff2")
        format("woff2"),
      url("/static/font/akzidenz/akzidgrostdlig-webfont.woff") format("woff");
  }
`;

// Akzidenz Light Italic
const akzidenzLightItalic = css`
  @font-face {
    font-display: swap;
    font-family: "Akzidenz";
    font-weight: 200;
    font-style: italic;
    src: url("/static/font/akzidenz/akzidgrostdligita-webfont.woff2")
        format("woff2"),
      url("/static/font/akzidenz/akzidgrostdligita-webfont.woff") format("woff");
  }
`;

// Akzidenz Regular
const akzidenzRegular = css`
  @font-face {
    font-display: swap;
    font-family: "Akzidenz";
    font-weight: normal;
    src: url("/static/font/akzidenz/akzidgrostdreg-webfont.woff2")
        format("woff2"),
      url("/static/font/akzidenz/akzidgrostdreg-webfont.woff") format("woff");
  }
`;

// Akzidenz Regular Italic
const akzidenzRegularItalic = css`
  @font-face {
    font-display: swap;
    font-family: "Akzidenz";
    font-style: italic;
    src: url("/static/font/akzidenz/akzidgrostdita-webfont.woff2")
        format("woff2"),
      url("/static/font/akzidenz/akzidgrostdita-webfont.woff") format("woff");
  }
`;

// Akzidenz Medium - MongoDB uses Medium as default bold for Akzidenz
const akzidenzMedium = css`
  @font-face {
    font-display: swap;
    font-family: "Akzidenz";
    font-weight: bold;
    src: url("/static/font/akzidenz/akzidgrostdmed-webfont.woff2")
        format("woff2"),
      url("/static/font/akzidenz/akzidgrostdmed-webfont.woff") format("woff");
  }
`;

// Akzidenz Medium Italic
const akzidenzMediumItalic = css`
  @font-face {
    font-display: swap;
    font-family: "Akzidenz";
    font-weight: bold;
    font-style: italic;
    src: url("/static/font/akzidenz/akzidgrostdmedita-webfont.woff2")
        format("woff2"),
      url("/static/font/akzidenz/akzidgrostdmedita-webfont.woff") format("woff");
  }
`;

// Akzidenz Bold
const akzidenzBold = css`
  @font-face {
    font-display: swap;
    font-family: "Akzidenz";
    font-weight: 800;
    src: url("/static/font/akzidenz/akzidgrostdbol-webfont.woff2")
        format("woff2"),
      url("/static/font/akzidenz/akzidgrostdbol-webfont.woff") format("woff");
  }
`;

// Akzidenz Bold Italic
const akzidenzBoldItalic = css`
  @font-face {
    font-display: swap;
    font-family: "Akzidenz";
    font-weight: 800;
    font-style: italic;
    src: url("/static/font/akzidenz/akzidgrostdbolita-webfont.woff2")
        format("woff2"),
      url("/static/font/akzidenz/akzidgrostdbolita-webfont.woff") format("woff");
  }
`;

export const akzidenzFont = css`
  ${akzidenzLight}
  ${akzidenzLightItalic}
  ${akzidenzRegular}
  ${akzidenzRegularItalic}
  ${akzidenzMedium}
  ${akzidenzMediumItalic}
  ${akzidenzBold}
  ${akzidenzBoldItalic}
`;
