import gql from "graphql-tag";

export const SCHEDULE_PATCH = gql`
  mutation SchedulePatch($patchId: String!, $reconfigure: PatchReconfigure!) {
    schedulePatch(patchId: $patchId, reconfigure: $reconfigure) {
      id
      activated
      version
      description
      status
      version
      activated
      tasks
      variants
      variantsTasks {
        name
        tasks
      }
    }
  }
`;
