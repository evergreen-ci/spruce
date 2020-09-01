import { gql } from "@apollo/client";

export const GET_AWS_REGIONS = gql`
  query AWSRegions {
    awsRegions
  }
`;
