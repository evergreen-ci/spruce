import gql from "graphql-tag";

export const GET_TASK = gql`
  query GetTask($taskId: String!) {
    task(taskId: $taskId) {
      activatedBy
      baseTaskMetadata {
        baseTaskDuration
        baseTaskLink
      }
      createTime
      displayName
      finishTime
      hostId
      hostLink
      patchMetadata {
        author
      }
      patchNumber
      reliesOn {
        buildVariant
        metStatus
        name
        requiredStatus
        uiLink
      }
      startTime
      status
      timeTaken
      version
      revision
      failedTestCount
      spawnHostLink
    }
  }
`;

export enum MetStatus {
  Met = "MET",
  Unmet = "UNMET",
  Pending = "PENDING",
}

export enum RequiredStatus {
  MustFail = "MUST_FAIL",
  MustSucceed = "MUST_SUCCEED",
  MustFinish = "MUST_FINISH",
}

interface BaseTaskMetadata {
  baseTaskLink: string;
  baseTaskDuration: number;
}

export interface Dependency {
  buildVariant: string;
  metStatus: MetStatus;
  name: string;
  requiredStatus: RequiredStatus;
  uiLink: string;
}

interface PatchMetadata {
  author: string;
}

interface Task {
  activatedBy: string;
  baseTaskMetadata: BaseTaskMetadata;
  createTime: string;
  displayName: string;
  finishTime: string;
  hostId: string;
  hostLink: string;
  patchMetadata: PatchMetadata;
  patchNumber: number;
  reliesOn: Dependency[];
  startTime: string;
  status: string;
  timeTaken: number;
  version: string;
  revision: string;
  failedTestCount: number;
  spawnHostLink: string;
}

export interface TaskQuery {
  task: Task;
}
