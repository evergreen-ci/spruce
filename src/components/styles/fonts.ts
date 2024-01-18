import { css } from "@emotion/react";

const fontStyles = css`
  /* 
   * Euclid
  /*

  /* Semibold */
  @font-face {
    font-family: "Euclid Circular A";
    font-weight: 700;
    font-style: normal;
    src:
      url("/static/fonts/EuclidCircularA/EuclidCircularA-Semibold-WebXL.woff2")
        format("woff2"),
      url("/static/fonts/EuclidCircularA/EuclidCircularA-Semibold-WebXL.woff")
        format("woff");
  }

  /* Semibold Italic */
  @font-face {
    font-family: "Euclid Circular A";
    font-weight: 700;
    font-style: italic;
    src:
      url("/static/fonts/EuclidCircularA/EuclidCircularA-SemiboldItalic-WebXL.woff2")
        format("woff2"),
      url("/static/fonts/EuclidCircularA/EuclidCircularA-SemiboldItalic-WebXL.woff")
        format("woff");
  }

  /* Medium */
  @font-face {
    font-family: "Euclid Circular A";
    font-weight: 500;
    font-style: normal;
    src:
      url("/static/fonts/EuclidCircularA/EuclidCircularA-Medium-WebXL.woff2")
        format("woff2"),
      url("/static/fonts/EuclidCircularA/EuclidCircularA-Medium-WebXL.woff")
        format("woff");
  }

  /* Medium Italic */
  @font-face {
    font-family: "Euclid Circular A";
    font-weight: 500;
    font-style: italic;
    src:
      url("/static/fonts/EuclidCircularA/EuclidCircularA-MediumItalic-WebXL.woff2")
        format("woff2"),
      url("/static/fonts/EuclidCircularA/EuclidCircularA-MediumItalic-WebXL.woff")
        format("woff");
  }

  /* Normal */
  @font-face {
    font-family: "Euclid Circular A";
    font-weight: 400;
    font-style: normal;
    src:
      url("/static/fonts/EuclidCircularA/EuclidCircularA-Regular-WebXL.woff2")
        format("woff2"),
      url("/static/fonts/EuclidCircularA/EuclidCircularA-Regular-WebXL.woff")
        format("woff");
  }

  /* Italic */
  @font-face {
    font-family: "Euclid Circular A";
    font-weight: 400;
    font-style: italic;
    src:
      url("/static/fonts/EuclidCircularA/EuclidCircularA-RegularItalic-WebXL.woff2")
        format("woff2"),
      url("/static/fonts/EuclidCircularA/EuclidCircularA-RegularItalic-WebXL.woff")
        format("woff");
  }

  /* 
   * MongoDB Value Serif
  /*

  /* Bold */
  @font-face {
    font-family: "MongoDB Value Serif";
    font-weight: 700;
    font-style: normal;
    src:
      url("/static/fonts/MongoDBValueSerif/MongoDBValueSerif-Bold.woff2")
        format("woff2"),
      url("/static/fonts/MongoDBValueSerif/MongoDBValueSerif-Bold.woff")
        format("woff");
  }

  /* Medium */
  @font-face {
    font-family: "MongoDB Value Serif";
    font-weight: 500;
    font-style: normal;
    src:
      url("/static/fonts/MongoDBValueSerif/MongoDBValueSerif-Medium.woff2")
        format("woff2"),
      url("/static/fonts/MongoDBValueSerif/MongoDBValueSerif-Medium.woff")
        format("woff");
  }

  /* Regular */
  @font-face {
    font-family: "MongoDB Value Serif";
    font-weight: 400;
    font-style: normal;
    src:
      url("/static/fonts/MongoDBValueSerif/MongoDBValueSerif-Regular.woff2")
        format("woff2"),
      url("/static/fonts/MongoDBValueSerif/MongoDBValueSerif-Regular.woff")
        format("woff");
  }
`;

export default fontStyles;
