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
