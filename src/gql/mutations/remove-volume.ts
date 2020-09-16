import { gql } from "@apollo/client";

export const REMOVE_VOLUME = gql`
  mutation removeVolume($volumeId: String!) {
    removeVolume(volumeId: $volumeId)
  }
`;
