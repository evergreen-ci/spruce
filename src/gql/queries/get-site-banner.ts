import { gql } from "@apollo/client";

export const GET_SITE_BANNER = gql`
  query SiteBanner {
    siteBanner {
      text
      theme
    }
  }
`;
