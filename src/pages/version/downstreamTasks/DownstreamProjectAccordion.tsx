import { useReducer } from "react";
import { useQuery } from "@apollo/client";
import styled from "@emotion/styled";
import Button from "@leafygreen-ui/button";
import { InlineCode } from "@leafygreen-ui/typography";
import { Skeleton } from "antd";
import { TableProps } from "antd/es/table";
import { useParams } from "react-router-dom";
import { useVersionAnalytics } from "analytics";
import { Accordion, AccordionWrapper } from "components/Accordion";
import PageSizeSelector from "components/PageSizeSelector";
import { Pagination } from "components/Pagination";
import { PatchStatusBadge } from "components/PatchStatusBadge";
import { ResultCountLabel } from "components/ResultCountLabel";
import { TableControlOuterRow, TableControlInnerRow } from "components/styles";
import { TasksTable } from "components/Table/TasksTable";
import { getVersionRoute } from "constants/routes";
import { size } from "constants/tokens";
import { useToastContext } from "context/toast";
import {
  SortDirection,
  SortOrder,
  Task,
  TaskSortCategory,
  VersionTasksQuery,
  VersionTasksQueryVariables,
} from "gql/generated/types";
import { GET_VERSION_TASKS } from "gql/queries";
import { usePolling, useTaskStatuses } from "hooks";
import { queryString, string } from "utils";
import { reducer } from "./reducer";

const { parseSortString, toSortString } = queryString;
const { shortenGithash } = string;

interface DownstreamProjectAccordionProps {
  baseVersionID: string;
  githash: string;
  projectName: string;
  status: string;
  taskCount: number;
  childPatchId: string;
}

export const DownstreamProjectAccordion: React.VFC<
  DownstreamProjectAccordionProps
> = ({
  baseVersionID,
  childPatchId,
  githash,
  projectName,
  status,
  taskCount,
}) => {
  const dispatchToast = useToastContext();

  const { id } = useParams<{ id: string }>();
  const { sendEvent } = useVersionAnalytics(id);

  const defaultSort: SortOrder = {
    Key: TaskSortCategory.Status,
    Direction: SortDirection.Asc,
  };

  const [state, dispatch] = useReducer(reducer, {
    baseStatuses: [],
    limit: 10,
    page: 0,
    statuses: [],
    taskName: "",
    variant: "",
    baseStatusesInputVal: [],
    currentStatusesInputVal: [],
    taskNameInputVal: "",
    variantInputVal: "",
    sorts: [defaultSort],
  });

  const { baseStatuses, limit, page, sorts, statuses, taskName, variant } =
    state;

  const variables = {
    versionId: childPatchId,
    taskFilterOptions: {
      limit,
      page,
      statuses,
      taskName,
      variant,
      sorts,
      baseStatuses,
    },
  };

  const { baseStatusesInputVal, currentStatusesInputVal } = state;
  const { currentStatuses, baseStatuses: currentBaseStatuses } =
    useTaskStatuses({
      versionId: childPatchId,
    });

  const taskNameInputProps = {
    placeholder: "Task name",
    value: state.taskNameInputVal,
    onChange: ({ target }) =>
      dispatch({ type: "onChangeTaskNameInput", task: target.value }),
    onFilter: () => dispatch({ type: "onFilterTaskNameInput" }),
  };

  const variantInputProps = {
    placeholder: "Variant name",
    value: state.variantInputVal,
    onChange: ({ target }) =>
      dispatch({
        type: "onChangeVariantInput",
        variant: target.value,
      }),
    onFilter: () => dispatch({ type: "onFilterVariantInput" }),
  };

  const baseStatusSelectorProps = {
    state: baseStatusesInputVal,
    tData: currentBaseStatuses,
    onChange: (s: string[]) =>
      dispatch({ type: "setAndSubmitBaseStatusesSelector", baseStatuses: s }),
  };

  const statusSelectorProps = {
    state: currentStatusesInputVal,
    tData: currentStatuses,
    onChange: (s: string[]) =>
      dispatch({
        type: "setAndSubmitStatusesSelector",
        statuses: s,
      }),
  };

  const { data, refetch, startPolling, stopPolling } = useQuery<
    VersionTasksQuery,
    VersionTasksQueryVariables
  >(GET_VERSION_TASKS, {
    variables,
    fetchPolicy: "cache-and-network",
    onError: (err) => {
      dispatchToast.error(`Error fetching downstream tasks ${err}`);
    },
  });
  usePolling({ startPolling, stopPolling, refetch });
  const showSkeleton = !data;
  const { version } = data || {};
  const { tasks } = version || {};
  const { data: tasksData = [], count = 0 } = tasks || {};

  const variantTitle = (
    <>
      <ProjectTitleWrapper>
        <span data-cy="project-title">{projectName}</span>
      </ProjectTitleWrapper>
      <PatchStatusBadge status={status} />
    </>
  );

  const tableChangeHandler: TableProps<Task>["onChange"] = (...[, , sorter]) =>
    dispatch({
      type: "onSort",
      sorts: parseSortString(toSortString(sorter)),
    });

  return (
    <AccordionWrapper data-cy="project-accordion">
      <Accordion title={variantTitle} titleTag={FlexContainer}>
        <AccordionContents>
          <p>
            Base commit:{" "}
            <InlineCode
              data-cy="downstream-task-base-commit"
              href={getVersionRoute(baseVersionID)}
            >
              {shortenGithash(githash)}
            </InlineCode>
          </p>
          <TableWrapper>
            <TableControlOuterRow>
              <FlexContainer>
                <ResultCountLabel
                  dataCyNumerator="current-task-count"
                  dataCyDenominator="total-task-count"
                  label="tasks"
                  numerator={count}
                  denominator={taskCount}
                />
                <PaddedButton
                  onClick={() => {
                    dispatch({ type: "clearAllFilters" });
                  }}
                  data-cy="clear-all-filters"
                >
                  Clear All Filters
                </PaddedButton>
              </FlexContainer>
              <TableControlInnerRow>
                <Pagination
                  data-cy="downstream-tasks-table-pagination"
                  onChange={(p) =>
                    dispatch({ type: "onChangePagination", page: p - 1 })
                  }
                  pageSize={limit}
                  totalResults={count}
                  value={page}
                />
                <PageSizeSelector
                  data-cy="tasks-table-page-size-selector"
                  value={limit}
                  onChange={(l) =>
                    dispatch({ type: "onChangeLimit", limit: l })
                  }
                />
              </TableControlInnerRow>
            </TableControlOuterRow>
            {showSkeleton ? (
              <Skeleton active title={false} paragraph={{ rows: 8 }} />
            ) : (
              <TasksTable
                sorts={sorts}
                tableChangeHandler={tableChangeHandler}
                tasks={tasksData}
                statusSelectorProps={statusSelectorProps}
                baseStatusSelectorProps={baseStatusSelectorProps}
                taskNameInputProps={taskNameInputProps}
                variantInputProps={variantInputProps}
                onColumnHeaderClick={(sortField) =>
                  sendEvent({
                    name: "Sort Downstream Tasks Table",
                    sortBy: sortField,
                  })
                }
              />
            )}
          </TableWrapper>
        </AccordionContents>
      </Accordion>
    </AccordionWrapper>
  );
};

const ProjectTitleWrapper = styled.div`
  margin-right: ${size.xs};
  font-weight: bold;
`;

const TableWrapper = styled.div`
  padding: ${size.s} 0;
`;

const AccordionContents = styled.div`
  margin: ${size.s} 0;
`;

const FlexContainer = styled.div`
  display: flex;
  align-items: center;
`;

const PaddedButton = styled(Button)`
  margin-left: ${size.s};
`;
