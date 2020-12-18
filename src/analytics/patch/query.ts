import { gql } from "@apollo/client";

export const GET_PATCH_EVENT_DATA = gql`
  query GetPatchEventData($id: String!) {
    patch(id: $id) {
      status
    }
  }
`;
