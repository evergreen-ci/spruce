import { gql } from "@apollo/client";

export const GET_SPAWN_TASK = gql`
  query GetSpawnTask($taskId: String!, $execution: Int) {
    task(taskId: $taskId, execution: $execution) {
      id
      displayName
      buildVariant
      revision
      canSync
      project {
        spawnHostScriptPath
      }
    }
  }
`;
