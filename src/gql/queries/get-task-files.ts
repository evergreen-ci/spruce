import gql from "graphql-tag";

export const GET_TASK_FILES = gql`
  query taskFiles($id: String!) {
    taskFiles(taskId: $id) {
      taskName
      files {
        name
        link
      }
    }
  }
`;
export interface File {
  name: string;
  link: string;
}

export interface TaskFilesData {
  taskName: string;
  files: [File];
}

export interface TaskFilesVars {
  id: string;
}

export interface TaskFilesResponse {
  taskFiles: [TaskFilesData];
}
