import { useQuery } from "@apollo/client";
import { useParams } from "react-router-dom";
import { useAnalyticsRoot } from "analytics/useAnalyticsRoot";
import {
  SaveSubscriptionForUserMutationVariables,
  TaskQuery,
  TaskQueryVariables,
  TaskSortCategory,
  TestSortCategory,
} from "gql/generated/types";
import { TASK } from "gql/queries";
import { useQueryParam } from "hooks/useQueryParam";
import { CommitType } from "pages/task/actionButtons/previousCommits/types";
import { RequiredQueryParams, LogTypes } from "types/task";

type LogViewer = "raw" | "html" | "parsley";
type Action =
  | { name: "Filter Tests"; filterBy: string | string[] }
  | {
      name: "Sort Tests Table";
      sortBy: TestSortCategory | TestSortCategory[];
    }
  | {
      name: "Sort Execution Tasks Table";
      sortBy:
        | TaskSortCategory.Name
        | TaskSortCategory.Status
        | TaskSortCategory.BaseStatus
        | TaskSortCategory.Variant;
    }
  | { name: "Restart" }
  | { name: "Schedule" }
  | { name: "Abort" }
  | { name: "Set Priority"; priority: number }
  | { name: "Unschedule" }
  | { name: "Change Page Size" }
  | { name: "Change Tab"; tab: string }
  | { name: "Change Execution" }
  | { name: "Click Logs Button"; logType: LogTypes; logViewer: LogViewer }
  | { name: "Click Test Logs Button"; logViewer: LogViewer; testStatus: string }
  | { name: "Click Annotation Link"; linkText: string }
  | { name: "Select Logs Type"; logType: LogTypes }
  | { name: "Open Notification Modal" }
  | {
      name: "Add Notification";
      subscription: SaveSubscriptionForUserMutationVariables["subscription"];
    }
  | { name: "Click Base Commit" }
  | { name: "Click Host Link" }
  | { name: "Click Pod Link" }
  | { name: "Click Spawn Host" }
  | { name: "Click Distro Link" }
  | { name: "Click Build Variant Link" }
  | { name: "Click Execution Task Link" }
  | { name: "Click Display Task Link" }
  | { name: "Click Project Link" }
  | { name: "Click See History Button" }
  | {
      name: "Click Task File Link";
      parsleyAvailable: boolean;
      fileName: string;
    }
  | {
      name: "Click Task File Parsley Link";
      fileName: string;
    }
  | { name: "Click Trace Link" }
  | { name: "Click Trace Metrics Link" }
  | { name: "Click Last Passing Stepback Task Link" }
  | { name: "Click Last Failing Stepback Task Link" }
  | { name: "Click Previous Stepback Task Link" }
  | { name: "Click Next Stepback Task Link" }
  | { name: "Submit Previous Commit Selector"; type: CommitType };

export const useTaskAnalytics = () => {
  const { id } = useParams<{ id: string }>();

  const [execution] = useQueryParam(RequiredQueryParams.Execution, 0);
  const { data: eventData } = useQuery<TaskQuery, TaskQueryVariables>(TASK, {
    variables: { taskId: id, execution },
    fetchPolicy: "cache-first",
  });

  const {
    failedTestCount,
    latestExecution,
    project: { identifier } = { identifier: null },
    status: taskStatus,
  } = eventData?.task || {};
  const isLatestExecution = latestExecution === execution;

  return useAnalyticsRoot<Action>("Task", {
    taskStatus,
    execution,
    isLatestExecution: isLatestExecution.toString(),
    taskId: id,
    failedTestCount,
    projectIdentifier: identifier,
  });
};
