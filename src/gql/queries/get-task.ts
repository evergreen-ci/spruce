import gql from "graphql-tag";

export const GET_TASK = gql`
  query GetTask($taskId: String!, $execution: Int) {
    taskFiles(taskId: $taskId, execution: $execution) {
      fileCount
    }
    task(taskId: $taskId, execution: $execution) {
      activatedBy
      baseTaskMetadata {
        baseTaskDuration
        baseTaskLink
      }
      createTime
      estimatedStart
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
      logs {
        allLogLink
        agentLogLink
        systemLogLink
        taskLogLink
        eventLogLink
      }
      startTime
      status
      timeTaken
      version
      revision
      failedTestCount
      spawnHostLink
      priority
      canRestart
      canAbort
      canSchedule
      canUnschedule
      canSetPriority
      ami
      distroId
      latestExecution
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
