import gql from "graphql-tag"

export const GET_TASK_FILES = gql`
query taskFiles(
    $id: String!
) {
    taskFiles(taskId: $id) {
        taskName
        files {
            name
            link
            visibility
        }
    }
}
`
interface File {
    name: string;
    link: string;
    visibility: string;
} 

export interface TaskFilesData {
    name: string;
    files: [File]
}

export interface TaskFilesVars {
    id: string;
}

