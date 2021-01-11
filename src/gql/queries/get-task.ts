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
        patchID
      }
      projectId
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
      minQueuePosition
      details {
        oomTracker {
          detected
          pids
        }
      }
      annotation {
        id
        taskId
        taskExecution
        note {
          source {
            author
            time
            requester
          }
          message
        }
        issues {
          issueKey
          url
          source {
            author
            time
            requester
          }
          jiraTicket {
            key
            fields {
              summary
              assigneeDisplayName
              resolutionName
              created
              updated
              status {
                id
                name
              }
              assignedTeam
            }
          }
        }
        suspectedIssues {
          issueKey
          url
          source {
            author
            time
            requester
          }
          jiraTicket {
            key
            fields {
              summary
              assigneeDisplayName
              resolutionName
              created
              updated
              status {
                id
                name
              }
              assignedTeam
            }
          }
        }
        userCanModify
      }
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
