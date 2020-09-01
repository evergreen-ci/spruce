import { gql } from "@apollo/client";

export const UPDATE_PUBLIC_KEY = gql`
  mutation UpdatePublicKey(
    $targetKeyName: String!
    $updateInfo: PublicKeyInput!
  ) {
    updatePublicKey(targetKeyName: $targetKeyName, updateInfo: $updateInfo) {
      key
      name
    }
  }
`;
