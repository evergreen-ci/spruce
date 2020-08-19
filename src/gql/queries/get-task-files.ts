import gql from "graphql-tag";

export const GET_TASK_FILES = gql`
  query TaskFiles($id: String!, $execution: Int) {
    taskFiles(taskId: $id, execution: $execution) {
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
