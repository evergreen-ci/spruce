import gql from "graphql-tag";

export const GET_TASK_FILES = gql`
  query taskFiles($id: String!) {
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
