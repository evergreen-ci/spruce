import { gql } from "@apollo/client";

export const SCHEDULE_PATCH = gql`
  mutation SchedulePatch($patchId: String!, $configure: PatchConfigure!) {
    schedulePatch(patchId: $patchId, configure: $configure) {
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
      parameters {
        key
        value
      }
    }
  }
`;
