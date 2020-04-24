import gql from "graphql-tag";
import { PatchStatus } from "types/patch";
import { SortDir } from "gql/queries/get-task-tests";

export const PATCH_TASKS_LIMIT = 10;

export const GET_PATCH_TASKS = gql`
  query PatchTasks(
    $patchId: String!
    $sortBy: TaskSortCategory
    $sortDir: SortDirection
    $page: Int
    $statuses: [String!]
    $baseStatuses: [String!]
    $variant: String
    $taskName: String
  ) {
    patchTasks(
      patchId: $patchId
      limit: ${PATCH_TASKS_LIMIT}
      page: $page
      statuses: $statuses
      baseStatuses: $baseStatuses
      sortDir: $sortDir
      sortBy: $sortBy
      variant: $variant
      taskName: $taskName
    ) {
      count
      tasks {
        id
        status
        baseStatus
        displayName
        buildVariant
      }
    }
  }
`;

export interface TaskResult {
  id: string;
  status: string;
  baseStatus: string;
  displayName: string;
  buildVariant: string;
}

export interface PatchTasks {
  count: number;
  tasks: TaskResult[];
}
export interface PatchTasksQuery {
  patchTasks: PatchTasks;
}

export enum TaskSortBy {
  Name = "NAME",
  Status = "STATUS",
  BaseStatus = "BASE_STATUS",
  Variant = "VARIANT",
}

export enum TaskSortDir {
  Desc = "DESC",
  Asc = "ASC",
}

export interface PatchTasksVariables {
  patchId: string;
  sortBy?: TaskSortBy;
  sortDir?: SortDir;
  page?: number;
  statuses?: [PatchStatus];
  baseStatuses?: [PatchStatus];
  variant?: string;
  taskName?: string;
}
