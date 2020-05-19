import gql from "graphql-tag";

export const SET_PATCH_PRIORITY = gql`
  mutation SetPatchPriority($patchId: String!, $priority: Int!) {
    setPatchPriority(patchId: $patchId, priority: $priority)
  }
`;
