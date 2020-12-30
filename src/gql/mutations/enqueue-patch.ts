import { gql } from "@apollo/client";

export const ENQUEUE_PATCH = gql`
  mutation EnqueuePatch($patchId: String!, $commitMessage: String!) {
    enqueuePatch(patchId: $patchId, commitMessage: $commitMessage) {
      id
    }
  }
`;
