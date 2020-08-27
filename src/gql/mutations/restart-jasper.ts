import { gql } from "@apollo/client";

export const RESTART_JASPER = gql`
  mutation RestartJasper($hostIds: [String!]!) {
    restartJasper(hostIds: $hostIds)
  }
`;
