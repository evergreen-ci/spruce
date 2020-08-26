import { gql } from "@apollo/client";

export const UPDATE_HOST_STATUS = gql`
  mutation UpdateHostStatus(
    $hostIds: [String!]!
    $status: String!
    $notes: String
  ) {
    updateHostStatus(hostIds: $hostIds, status: $status, notes: $notes)
  }
`;
