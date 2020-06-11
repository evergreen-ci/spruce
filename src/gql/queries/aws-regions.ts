import gql from "graphql-tag";

export const AWS_REGIONS = gql`
  query AWSRegions {
    awsRegions
  }
`;
