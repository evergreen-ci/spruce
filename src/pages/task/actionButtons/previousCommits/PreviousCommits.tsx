import { useReducer, useEffect } from "react";
import { useLazyQuery, useQuery } from "@apollo/client";
import styled from "@emotion/styled";
import Button from "@leafygreen-ui/button";
import { Option, Select } from "@leafygreen-ui/select";
import Tooltip from "@leafygreen-ui/tooltip";
import { useTaskAnalytics } from "analytics";
import { ConditionalWrapper } from "components/ConditionalWrapper";
import { finishedTaskStatuses } from "constants/task";
import { size } from "constants/tokens";
import {
  BaseVersionAndTaskQuery,
  BaseVersionAndTaskQueryVariables,
  LastMainlineCommitQuery,
  LastMainlineCommitQueryVariables,
} from "gql/generated/types";
import {
  GET_BASE_VERSION_AND_TASK,
  GET_LAST_MAINLINE_COMMIT,
} from "gql/queries";
import { useLGButtonRouterLink } from "hooks/useLGButtonRouterLink";
import { TaskStatus } from "types/task";
import { string } from "utils";
import { reportError } from "utils/errorReporting";
import { initialState, reducer } from "./reducer";
import { CommitTask, CommitType } from "./types";

const { applyStrictRegex } = string;

interface PreviousCommitsProps {
  taskId: string;
}
export const PreviousCommits: React.VFC<PreviousCommitsProps> = ({
  taskId,
}) => {
  const { sendEvent } = useTaskAnalytics();
  const [
    {
      selectState,
      disableButton,
      link,
      shouldFetchLastPassing,
      shouldFetchLastExecuted,
      hasFetchedLastPassing,
      hasFetchedLastExecuted,
    },
    dispatch,
  ] = useReducer(reducer, initialState);

  const { data: taskData } = useQuery<
    BaseVersionAndTaskQuery,
    BaseVersionAndTaskQueryVariables
  >(GET_BASE_VERSION_AND_TASK, {
    variables: { taskId },
  });

  const [fetchParentTask, { loading: parentLoading }] = useLazyQuery<
    LastMainlineCommitQuery,
    LastMainlineCommitQueryVariables
  >(GET_LAST_MAINLINE_COMMIT, {
    onCompleted: (data) => {
      dispatch({
        type: "setParentTask",
        task: getTaskFromMainlineCommitsQuery(data),
      });
    },
  });

  const [fetchLastPassing, { loading: passingLoading }] = useLazyQuery<
    LastMainlineCommitQuery,
    LastMainlineCommitQueryVariables
  >(GET_LAST_MAINLINE_COMMIT, {
    onCompleted: (data) => {
      dispatch({
        type: "setLastPassingTask",
        task: getTaskFromMainlineCommitsQuery(data),
      });
    },
  });

  const [fetchLastExecuted, { loading: executedLoading }] = useLazyQuery<
    LastMainlineCommitQuery,
    LastMainlineCommitQueryVariables
  >(GET_LAST_MAINLINE_COMMIT, {
    onCompleted: (data) => {
      dispatch({
        type: "setLastExecutedTask",
        task: getTaskFromMainlineCommitsQuery(data),
      });
    },
  });

  const { baseTask, versionMetadata, buildVariant, displayName } =
    taskData?.task ?? {};
  const { projectIdentifier, order: skipOrderNumber } =
    versionMetadata?.baseVersion ?? {};
  const bvOptionsBase = {
    tasks: [applyStrictRegex(displayName)],
    variants: [applyStrictRegex(buildVariant)],
  };
  const loading = parentLoading || passingLoading || executedLoading;

  // Hook to determine the parent task. If mainline commit, use fetchParentTask function to get task from
  // previous mainline commit. Otherwise, just extract the base task from the task data.
  useEffect(() => {
    if (versionMetadata) {
      if (!versionMetadata.isPatch) {
        fetchParentTask({
          variables: {
            projectIdentifier,
            skipOrderNumber,
            buildVariantOptions: {
              ...bvOptionsBase,
            },
          },
        });
      } else {
        dispatch({ type: "setParentTask", task: baseTask });
      }
    }
  }, [versionMetadata]); // eslint-disable-line react-hooks/exhaustive-deps

  // Hook that triggers fetching the last passing task if it needs to be fetched.
  useEffect(() => {
    if (!hasFetchedLastPassing && shouldFetchLastPassing) {
      fetchLastPassing({
        variables: {
          projectIdentifier,
          skipOrderNumber,
          buildVariantOptions: {
            ...bvOptionsBase,
            statuses: [TaskStatus.Succeeded],
          },
        },
      });
    }
  }, [shouldFetchLastPassing]); // eslint-disable-line react-hooks/exhaustive-deps

  // Hook that triggers fetching the last executed task if it needs to be fetched.
  useEffect(() => {
    if (!hasFetchedLastExecuted && shouldFetchLastExecuted) {
      fetchLastExecuted({
        variables: {
          projectIdentifier,
          skipOrderNumber,
          buildVariantOptions: {
            ...bvOptionsBase,
            statuses: finishedTaskStatuses,
          },
        },
      });
    }
  }, [shouldFetchLastExecuted]); // eslint-disable-line react-hooks/exhaustive-deps

  const Link = useLGButtonRouterLink(link);

  return (
    <PreviousCommitsWrapper>
      <StyledSelect
        size="small"
        data-cy="previous-commits-select"
        label="Previous commits for this task"
        allowDeselect={false}
        onChange={(v: CommitType) =>
          dispatch({ type: "setSelectState", selectState: v })
        }
        value={selectState}
        disabled={!versionMetadata?.baseVersion}
      >
        <Option value={CommitType.Base}>
          Go to {versionMetadata?.isPatch ? "base" : "previous"} commit
        </Option>
        <Option value={CommitType.LastPassing}>
          Go to last passing version
        </Option>
        <Option value={CommitType.LastExecuted}>
          Go to last executed version
        </Option>
      </StyledSelect>

      <ConditionalWrapper
        condition={disableButton}
        wrapper={(children) => (
          <Tooltip
            align="top"
            justify="middle"
            triggerEvent="hover"
            trigger={children}
          >
            {loading
              ? `Fetching...`
              : `There is no version that satisfies this criteria.`}
          </Tooltip>
        )}
      >
        {/* This div is necessary, or else the tooltip will not show. */}
        <div>
          <Button
            onClick={() =>
              sendEvent({
                name: "Submit Previous Commit Selector",
                type: selectState,
              })
            }
            as={Link}
            disabled={disableButton}
            size="small"
            data-cy="previous-commits-go-button"
          >
            Go
          </Button>
        </div>
      </ConditionalWrapper>
    </PreviousCommitsWrapper>
  );
};

// The return value from GetLastMainlineCommitQuery has a lot of nested fields that may or may
// not exist. The logic to extract the task from it is written in this function.
const getTaskFromMainlineCommitsQuery = (
  data: LastMainlineCommitQuery
): CommitTask => {
  const buildVariants =
    data?.mainlineCommits.versions.find(({ version }) => version)?.version
      .buildVariants ?? [];
  if (buildVariants.length > 1) {
    reportError(
      new Error("Multiple build variants matched previous commit search.")
    ).warning();
  }
  if (buildVariants[0]?.tasks.length > 1) {
    reportError(
      new Error("Multiple tasks matched previous commit search.")
    ).warning();
  }
  return buildVariants[0]?.tasks[0];
};

const PreviousCommitsWrapper = styled.div`
  display: flex;
  align-items: flex-start;
`;

// @ts-expect-error
const StyledSelect = styled(Select)`
  width: 220px;
  margin-right: ${size.xs};
  margin-top: -23px;
`;
