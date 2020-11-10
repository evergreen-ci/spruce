import { gql } from "@apollo/client";

export const GET_TASK = gql`
  query GetTask($taskId: String!, $execution: Int) {
    taskFiles(taskId: $taskId, execution: $execution) {
      fileCount
    }
    task(taskId: $taskId, execution: $execution) {
      id
      activatedBy
      baseTaskMetadata {
        baseTaskDuration
        baseTaskLink
      }
      buildVariant
      ingestTime
      estimatedStart
      displayName
      finishTime
      hostId
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
      totalTestCount
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
      blocked
      generatedBy
      generatedByName
      isPerfPluginEnabled
      details {
        oomTracker {
          detected
          pids
        }
      }
    }
  }
`;

export const GET_TASK_LATEST_EXECUTION = gql`
  query GetTaskLatestExecution($taskId: String!) {
    task(taskId: $taskId) {
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
