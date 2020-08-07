import gql from "graphql-tag";

export const RESTART_JASPER = gql`
  mutation RestartJasper($hostIds: [String!]!) {
    restartJasper(hostIds: $hostIds)
  }
`;
