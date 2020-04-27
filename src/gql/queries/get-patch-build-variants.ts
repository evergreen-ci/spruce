import gql from "graphql-tag";

export const GET_PATCH_BUILD_VARIANTS = gql`
  query PatchBuildVariants($patchId: String!) {
    patchBuildVariants(patchId: $patchId) {
      variant
      tasks {
        id
        name
        status
      }
    }
  }
`;
