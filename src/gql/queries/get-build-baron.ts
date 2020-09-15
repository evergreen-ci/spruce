import { gql } from "@apollo/client";

export const GET_BUILD_BARON = gql`
  query BuildBaron($taskId: String!, $execution: Int!) {
    buildBaron(taskId: $taskId, execution: $execution) {
      buildBaronConfigured
      searchReturnInfo {
        issues {
          key
          fields {
            summary
            assigneeDisplayName
            resolutionName
            created
            updated
            status {
              id
              name
            }
          }
        }
        search
        source
        featuresURL
      }
    }
  }
`;
