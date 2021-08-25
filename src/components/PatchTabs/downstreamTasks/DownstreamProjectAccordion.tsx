import { useReducer } from "react";
import { useQuery } from "@apollo/client";
import styled from "@emotion/styled";
import Button from "@leafygreen-ui/button";
import { InlineCode } from "@leafygreen-ui/typography";
import { Skeleton } from "antd";
import { Accordion } from "components/Accordion";
import { PageSizeSelector } from "components/PageSizeSelector";
import { Pagination } from "components/Pagination";
import { PatchStatusBadge } from "components/PatchStatusBadge";
import { ResultCountLabel } from "components/ResultCountLabel";
import { TableControlOuterRow, TableControlInnerRow } from "components/styles";
import { TasksTable } from "components/Table/TasksTable";
import { useToastContext } from "context/toast";
import {
  PatchTasksQuery,
  PatchTasksQueryVariables,
  SortDirection,
  SortOrder,
  TaskSortCategory,
} from "gql/generated/types";
import { GET_PATCH_TASKS } from "gql/queries";
import { useNetworkStatus } from "hooks";
import { environmentalVariables, queryString } from "utils";
import { FilterState, TaskFilters } from "./TaskFilters";

const { getUiUrl } = environmentalVariables;
const { parseSortString, toSortString } = queryString;

interface DownstreamProjectAccordionProps {
  baseVersionID: string;
  githash: string;
  projectName: string;
  status: string;
  taskCount: number;
  childPatchId: string;
}

const reducer = (state: FilterState, newFields: Partial<FilterState>) => ({
  ...state,
  ...newFields,
});

export const DownstreamProjectAccordion: React.FC<DownstreamProjectAccordionProps> = ({
  baseVersionID,
  childPatchId,
  githash,
  projectName,
  status,
  taskCount,
}) => {
  const dispatchToast = useToastContext();

  const defaultSort: SortOrder = {
    Key: TaskSortCategory.Status,
    Direction: SortDirection.Asc,
  };

  const baseFilterVariables = {
    baseStatuses: [],
    limit: 10,
    page: 0,
    patchId: childPatchId,
    sorts: [],
    statuses: [],
    taskName: null,
    variant: null,
  };

  const [variables, setVariables] = useReducer(reducer, {
    ...baseFilterVariables,
    sorts: [defaultSort],
  });

  const { data, startPolling, stopPolling } = useQuery<
    PatchTasksQuery,
    PatchTasksQueryVariables
  >(GET_PATCH_TASKS, {
    variables,
    fetchPolicy: "cache-and-network",
    onError: (err) => {
      dispatchToast.error(`Error fetching downstream tasks ${err}`);
    },
  });
  const showSkeleton = !data;
  useNetworkStatus(startPolling, stopPolling);
  const { patchTasks } = data || {};

  const variantTitle = (
    <>
      <ProjectTitleWrapper>
        <span data-cy="project-title">{projectName}</span>
      </ProjectTitleWrapper>
      <PatchStatusBadge status={status} />
    </>
  );

  const tableChangeHandler = (...[, , sorter]) => {
    setVariables({
      sorts: parseSortString(toSortString(sorter)),
      page: 0,
    });
  };

  return (
    <AccordionWrapper data-cy="project-accordion">
      <Accordion
        title={variantTitle}
        contents={
          <AccordionContents>
            <p>
              Base commit:{" "}
              <InlineCode href={`${getUiUrl()}/version/${baseVersionID}`}>
                {githash.slice(0, 10)}
              </InlineCode>
            </p>
            <TaskFilters
              versionId={childPatchId}
              filters={variables}
              onFilterChange={setVariables}
            />
            <TableWrapper>
              <TableControlOuterRow>
                <FlexContainer>
                  <ResultCountLabel
                    dataCyNumerator="current-task-count"
                    dataCyDenominator="total-task-count"
                    label="tasks"
                    numerator={patchTasks?.count}
                    denominator={taskCount}
                  />
                  <PaddedButton // @ts-expect-error
                    onClick={() => {
                      setVariables(baseFilterVariables);
                    }}
                    data-cy="clear-all-filters"
                  >
                    Clear All Filters
                  </PaddedButton>
                </FlexContainer>
                <TableControlInnerRow>
                  <Pagination
                    data-cy="downstream-tasks-table-pagination"
                    onChange={(p) => setVariables({ page: p - 1 })}
                    pageSize={variables.limit}
                    totalResults={patchTasks?.count}
                    value={variables.page}
                  />
                  <PageSizeSelector
                    data-cy="tasks-table-page-size-selector"
                    value={variables.limit}
                    onClick={(l) => setVariables({ limit: l, page: 0 })}
                  />
                </TableControlInnerRow>
              </TableControlOuterRow>
              {showSkeleton ? (
                <Skeleton active title={false} paragraph={{ rows: 8 }} />
              ) : (
                <TasksTable
                  sorts={variables.sorts}
                  tableChangeHandler={tableChangeHandler}
                  tasks={patchTasks?.tasks}
                />
              )}
            </TableWrapper>
          </AccordionContents>
        }
      />
    </AccordionWrapper>
  );
};

const AccordionWrapper = styled.div`
  padding-bottom: 12px;
  padding-top: 12px;
`;

const ProjectTitleWrapper = styled.div`
  margin-right: 10px;
  font-weight: bold;
`;

const TableWrapper = styled.div`
  padding-bottom: 15px;
  padding-top: 15px;
`;

const AccordionContents = styled.div`
  margin: 16px 0;
`;

const FlexContainer = styled.div`
  display: flex;
  align-items: center;
`;

// @ts-expect-error
const PaddedButton = styled(Button)`
  margin-left: 15px;
`;
