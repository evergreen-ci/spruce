import { useReducer, useEffect } from "react";
import { useLazyQuery, useQuery } from "@apollo/client";
import styled from "@emotion/styled";
import Button from "@leafygreen-ui/button";
import { Option, Select } from "@leafygreen-ui/select";
import Tooltip from "@leafygreen-ui/tooltip";
import { Link } from "react-router-dom";
import { ConditionalWrapper } from "components/ConditionalWrapper";
import { finishedTaskStatuses } from "constants/task";
import { size } from "constants/tokens";
import {
  GetBaseVersionAndTaskQuery,
  GetBaseVersionAndTaskQueryVariables,
  GetLastMainlineCommitQuery,
  GetLastMainlineCommitQueryVariables,
} from "gql/generated/types";
import {
  GET_BASE_VERSION_AND_TASK,
  GET_LAST_MAINLINE_COMMIT,
} from "gql/queries";
import { TaskStatus, CommitTask, CommitType } from "types/task";
import { errorReporting, string } from "utils";
import { initialState, reducer } from "./reducer";

const { applyStrictRegex } = string;
const { reportError } = errorReporting;

interface PreviousCommitsProps {
  taskId: string;
}
export const PreviousCommits: React.FC<PreviousCommitsProps> = ({ taskId }) => {
  const [
    {
      selectState,
      disableButton,
      link,
      shouldFetchPassing,
      shouldFetchExecuted,
      hasFetchedPassing,
      hasFetchedExecuted,
    },
    dispatch,
  ] = useReducer(reducer, initialState);

  const { data: taskData } = useQuery<
    GetBaseVersionAndTaskQuery,
    GetBaseVersionAndTaskQueryVariables
  >(GET_BASE_VERSION_AND_TASK, {
    variables: { taskId },
  });

  const [fetchParentTask] = useLazyQuery<
    GetLastMainlineCommitQuery,
    GetLastMainlineCommitQueryVariables
  >(GET_LAST_MAINLINE_COMMIT, {
    onCompleted: (data) => {
      dispatch({
        type: "setParentTask",
        task: getTaskFromMainlineCommitsQuery(data),
      });
    },
  });

  const [fetchLastPassing] = useLazyQuery<
    GetLastMainlineCommitQuery,
    GetLastMainlineCommitQueryVariables
  >(GET_LAST_MAINLINE_COMMIT, {
    onCompleted: (data) => {
      dispatch({
        type: "setLastPassingTask",
        task: getTaskFromMainlineCommitsQuery(data),
      });
    },
  });

  const [fetchLastExecuted] = useLazyQuery<
    GetLastMainlineCommitQuery,
    GetLastMainlineCommitQueryVariables
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
  const { projectIdentifier, order } = versionMetadata?.baseVersion ?? {};
  const skipOrderNumber = versionMetadata?.isPatch ? order + 1 : order;
  const bvOptionsBase = {
    tasks: [applyStrictRegex(displayName)],
    variants: [applyStrictRegex(buildVariant)],
  };

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

  useEffect(() => {
    if (!hasFetchedPassing && shouldFetchPassing) {
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
  }, [shouldFetchPassing]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!hasFetchedExecuted && shouldFetchExecuted) {
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
  }, [shouldFetchExecuted]); // eslint-disable-line react-hooks/exhaustive-deps

  return versionMetadata?.isPatch !== undefined ? (
    <PreviousCommitsWrapper>
      <StyledSelect
        size="small"
        data-cy="previous-commits"
        label="Previous commits for this task"
        allowDeselect={false}
        onChange={(v: CommitType) =>
          dispatch({ type: "setSelectState", selectState: v })
        }
        value={selectState}
        disabled={!versionMetadata?.baseVersion}
      >
        <Option value={CommitType.Base}>
          Go to {versionMetadata?.isPatch ? "base commit" : "parent commit"}
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
            darkMode
          >
            There is no version that satisfies this criteria.
          </Tooltip>
        )}
      >
        {/* This div is necessary, or else the tooltip will not show. */}
        <div>
          <Button
            as={Link}
            to={link || "/"}
            disabled={disableButton}
            size="small"
          >
            Go
          </Button>
        </div>
      </ConditionalWrapper>
    </PreviousCommitsWrapper>
  ) : null;
};

// The return value from GetLastMainlineCommitQuery has a lot of nested fields that may or may
// not exist. The logic to extract the task from it is written in this function.
const getTaskFromMainlineCommitsQuery = (
  data: GetLastMainlineCommitQuery
): CommitTask => {
  const buildVariants =
    data?.mainlineCommits.versions.find(({ version }) => version)?.version
      .buildVariants ?? [];
  if (buildVariants.length > 1) {
    reportError(
      "Multiple build variants matched previous commit search."
    ).warning();
  }
  if (buildVariants[0]?.tasks.length > 1) {
    reportError("Multiple tasks matched previous commit search.").warning();
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

  position: relative;
  bottom: 20px; // to offset the label
`;
