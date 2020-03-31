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
export interface File {
  name: string;
  link: string;
}

export interface GroupedFiles {
  taskName: string;
  files: File[];
}

export interface TaskFilesVars {
  id: string;
}

interface TaskFilesData {
  groupedFiles: GroupedFiles[];
}

export interface TaskFilesResponse {
  taskFiles: TaskFilesData;
}
