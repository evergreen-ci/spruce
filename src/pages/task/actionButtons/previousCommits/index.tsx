import { useReducer, useEffect } from "react";
import { useLazyQuery, useQuery } from "@apollo/client";
import styled from "@emotion/styled";
import { Option, Select } from "@leafygreen-ui/select";
import Tooltip from "@leafygreen-ui/tooltip";
import { useTaskAnalytics } from "analytics";
import { LoadingButton } from "components/Buttons";
import { ConditionalWrapper } from "components/ConditionalWrapper";
import { finishedTaskStatuses } from "constants/task";
import { size } from "constants/tokens";
import { useToastContext } from "context/toast";
import {
  BaseVersionAndTaskQuery,
  BaseVersionAndTaskQueryVariables,
  LastMainlineCommitQuery,
  LastMainlineCommitQueryVariables,
} from "gql/generated/types";
import { BASE_VERSION_AND_TASK, LAST_MAINLINE_COMMIT } from "gql/queries";
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
export const PreviousCommits: React.FC<PreviousCommitsProps> = ({ taskId }) => {
  const { sendEvent } = useTaskAnalytics();
  const [
    {
      disableButton,
      hasFetchedLastExecuted,
      hasFetchedLastPassing,
      link,
      selectState,
      shouldFetchLastExecuted,
      shouldFetchLastPassing,
    },
    dispatch,
  ] = useReducer(reducer, initialState);
  const dispatchToast = useToastContext();

  const { data: taskData } = useQuery<
    BaseVersionAndTaskQuery,
    BaseVersionAndTaskQueryVariables
  >(BASE_VERSION_AND_TASK, {
    variables: { taskId },
  });

  // We don't error for this query because it is the default query that is run when the page loads.
  // If it errors it probably means there is no base version, which is fine.
  const [fetchParentTask, { loading: parentLoading }] = useLazyQuery<
    LastMainlineCommitQuery,
    LastMainlineCommitQueryVariables
  >(LAST_MAINLINE_COMMIT, {
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
  >(LAST_MAINLINE_COMMIT, {
    onCompleted: (data) => {
      dispatch({
        type: "setLastPassingTask",
        task: getTaskFromMainlineCommitsQuery(data),
      });
    },
    onError: (err) => {
      dispatchToast.error(`Last passing version unavailable: '${err.message}'`);
    },
  });

  const [fetchLastExecuted, { loading: executedLoading }] = useLazyQuery<
    LastMainlineCommitQuery,
    LastMainlineCommitQueryVariables
  >(LAST_MAINLINE_COMMIT, {
    onCompleted: (data) => {
      dispatch({
        type: "setLastExecutedTask",
        task: getTaskFromMainlineCommitsQuery(data),
      });
    },
    onError: (err) => {
      dispatchToast.error(
        `Could not fetch last task execution: '${err.message}'`
      );
    },
  });

  const { baseTask, buildVariant, displayName, versionMetadata } =
    taskData?.task ?? {};
  const { order: skipOrderNumber, projectIdentifier } =
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
        <LoadingButton
          as={Link}
          data-cy="previous-commits-go-button"
          disabled={disableButton}
          loading={loading}
          onClick={() =>
            sendEvent({
              name: "Submit Previous Commit Selector",
              type: selectState,
            })
          }
          size="small"
        >
          Go
        </LoadingButton>
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
