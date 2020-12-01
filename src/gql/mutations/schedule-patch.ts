import { gql } from "@apollo/client";

export const SCHEDULE_PATCH = gql`
  mutation SchedulePatch($patchId: String!, $reconfigure: PatchConfigure!) {
    schedulePatch(patchId: $patchId, configure: $reconfigure) {
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
