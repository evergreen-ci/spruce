import gql from "graphql-tag";

export const ENQUEUE_PATCH = gql`
  mutation EnqueuePatch($patchId: String!) {
    enqueuePatch(patchId: $patchId) {
      id
    }
  }
`;
