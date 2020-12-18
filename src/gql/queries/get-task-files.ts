import { gql } from "@apollo/client";

export const GET_TASK_FILES = gql`
  query TaskFiles($id: String!, $execution: Int) {
    taskFiles(taskId: $id, execution: $execution) {
      fileCount
      groupedFiles {
        taskName
        files {
          name
          link
        }
      }
    }
  }
`;
