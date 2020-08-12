import { gql } from "@apollo/client";

export const ENQUEUE_PATCH = gql`
  mutation EnqueuePatch($patchId: String!) {
    enqueuePatch(patchId: $patchId) {
      id
    }
  }
`;
