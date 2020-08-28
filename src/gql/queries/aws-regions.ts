import { gql } from "@apollo/client";

export const AWS_REGIONS = gql`
  query AWSRegions {
    awsRegions
  }
`;
