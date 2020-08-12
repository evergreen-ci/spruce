import { gql } from "@apollo/client";

export const GET_TASK_FILES = gql`
  query TaskFiles($id: String!) {
    taskFiles(taskId: $id) {
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
