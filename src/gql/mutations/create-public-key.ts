import { gql } from "@apollo/client";

export const CREATE_PUBLIC_KEY = gql`
  mutation CreatePublicKey($publicKeyInput: PublicKeyInput!) {
    createPublicKey(publicKeyInput: $publicKeyInput) {
      key
      name
    }
  }
`;
