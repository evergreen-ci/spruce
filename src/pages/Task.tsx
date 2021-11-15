import React from "react";
import { useQuery } from "@apollo/client";
import styled from "@emotion/styled";
import { useParams, useLocation } from "react-router-dom";
import { useTaskAnalytics } from "analytics";
import { BreadCrumb } from "components/Breadcrumb";
import { PageTitle } from "components/PageTitle";
import {
  PageWrapper,
  PageContent,
  PageLayout,
  PageSider,
} from "components/styles";
import TaskStatusBadge from "components/TaskStatusBadge";
import { pollInterval } from "constants/index";
import { useToastContext } from "context/toast";
import { GetTaskQuery, GetTaskQueryVariables } from "gql/generated/types";
import { GET_TASK } from "gql/queries";
import { usePageTitle, useNetworkStatus } from "hooks";
import { useUpdateURLQueryParams } from "hooks/useUpdateURLQueryParams";
import { PageDoesNotExist } from "pages/404";
import { RequiredQueryParams, TaskStatus } from "types/task";
import { queryString } from "utils";
import { ActionButtons } from "./task/ActionButtons";
import { ExecutionSelect } from "./task/executionDropdown/ExecutionSelector";
import { Metadata } from "./task/metadata";
import { TaskTabs } from "./task/TaskTabs";

const { parseQueryString } = queryString;

export const Task: React.FC = () => {
  const { id } = useParams<{ id: string; tab: string | null }>();
  const dispatchToast = useToastContext();
  const taskAnalytics = useTaskAnalytics();
  const location = useLocation();
  const updateQueryParams = useUpdateURLQueryParams();
  const parsed = parseQueryString(location.search);
  const selectedExecution = Number(parsed[RequiredQueryParams.Execution]);

  // Query task data
  const { data, loading, error, startPolling, stopPolling } = useQuery<
    GetTaskQuery,
    GetTaskQueryVariables
  >(GET_TASK, {
    variables: { taskId: id, execution: selectedExecution },
    pollInterval,
    fetchPolicy: "network-only",
    onError: (err) =>
      dispatchToast.error(
        `There was an error loading the task: ${err.message}`
      ),
  });

  useNetworkStatus(startPolling, stopPolling);
  const { task, taskFiles } = data ?? {};
  const {
    canAbort,
    canRestart,
    canSchedule,
    canUnschedule,
    canSetPriority,
    displayName,
    patchNumber,
    priority,
    status,
    annotation,
    latestExecution,
    versionMetadata,
    canOverrideDependencies,
    project,
  } = task ?? {};
  const attributed = annotation?.issues?.length > 0;

  // Set the execution if it isnt provided
  if (Number.isNaN(selectedExecution) && latestExecution !== undefined) {
    updateQueryParams({
      execution: `${latestExecution}`,
    });
  }

  usePageTitle(`Task${displayName ? ` - ${displayName}` : ""}`);

  if (error) {
    return <PageDoesNotExist />;
  }
  return (
    <PageWrapper>
      {task && (
        <BreadCrumb
          taskName={displayName}
          patchNumber={patchNumber}
          versionMetadata={versionMetadata}
        />
      )}
      <PageTitle
        loading={loading}
        hasData={!!(displayName && status)}
        title={displayName}
        badge={
          <StyledBadgeWrapper>
            <TaskStatusBadge status={status} />
            {attributed && <TaskStatusBadge status={TaskStatus.KnownIssue} />}
          </StyledBadgeWrapper>
        }
        buttons={
          <ActionButtons
            canAbort={canAbort}
            canRestart={canRestart}
            canSchedule={canSchedule}
            canUnschedule={canUnschedule}
            canSetPriority={canSetPriority}
            initialPriority={priority}
            canOverrideDependencies={canOverrideDependencies}
            taskName={displayName}
            projectIdentifier={project?.identifier}
          />
        }
      />
      <PageLayout>
        <PageSider>
          {latestExecution > 0 && (
            <ExecutionSelect
              id={id}
              currentExecution={selectedExecution}
              latestExecution={latestExecution}
              updateExecution={(n: number) => {
                taskAnalytics.sendEvent({ name: "Change Execution" });
                updateQueryParams({
                  execution: `${n}`,
                });
              }}
            />
          )}
          <Metadata taskId={id} task={task} loading={loading} error={error} />
        </PageSider>
        <LogWrapper>
          <PageContent>
            {task && <TaskTabs task={task} taskFiles={taskFiles} />}
          </PageContent>
        </LogWrapper>
      </PageLayout>
    </PageWrapper>
  );
};

const LogWrapper = styled(PageLayout)`
  width: 100%;
`;

const StyledBadgeWrapper = styled.div`
  > :nth-of-type(2) {
    margin-left: 10px;
  }
`;
