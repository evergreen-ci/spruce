import gql from "graphql-tag";

export const GET_SITE_BANNER = gql`
  query SiteBanner {
    siteBanner {
      text
      theme
    }
  }
`;
