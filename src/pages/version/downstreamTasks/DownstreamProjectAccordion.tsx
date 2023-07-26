import { useReducer } from "react";
import { useQuery } from "@apollo/client";
import styled from "@emotion/styled";
import { InlineCode } from "@leafygreen-ui/typography";
import { Skeleton } from "antd";
import { TableProps } from "antd/es/table";
import { Link, useParams } from "react-router-dom";
import { useVersionAnalytics } from "analytics";
import { Accordion } from "components/Accordion";
import { PatchStatusBadge } from "components/PatchStatusBadge";
import TableControl from "components/Table/TableControl";
import TableWrapper from "components/Table/TableWrapper";
import TasksTable from "components/TasksTable";
import { getVersionRoute } from "constants/routes";
import { size } from "constants/tokens";
import { useToastContext } from "context/toast";
import {
  Parameter,
  SortDirection,
  SortOrder,
  Task,
  TaskSortCategory,
  VersionTasksQuery,
  VersionTasksQueryVariables,
} from "gql/generated/types";
import { GET_VERSION_TASKS } from "gql/queries";
import { usePolling, useTaskStatuses } from "hooks";
import { PatchStatus } from "types/patch";
import { queryString, string } from "utils";
import { ParametersModal } from "../ParametersModal";
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
  parameters: Parameter[];
}

export const DownstreamProjectAccordion: React.VFC<
  DownstreamProjectAccordionProps
> = ({
  baseVersionID,
  childPatchId,
  githash,
  parameters,
  projectName,
  status,
  taskCount,
}) => {
  const dispatchToast = useToastContext();

  const { id } = useParams<{ id: string }>();
  const { sendEvent } = useVersionAnalytics(id);

  const defaultSort: SortOrder = {
    Direction: SortDirection.Asc,
    Key: TaskSortCategory.Status,
  };

  const [state, dispatch] = useReducer(reducer, {
    baseStatuses: [],
    baseStatusesInputVal: [],
    currentStatusesInputVal: [],
    limit: 10,
    page: 0,
    sorts: [defaultSort],
    statuses: [],
    taskName: "",
    taskNameInputVal: "",
    variant: "",
    variantInputVal: "",
  });

  const { baseStatuses, limit, page, sorts, statuses, taskName, variant } =
    state;

  const variables = {
    taskFilterOptions: {
      baseStatuses,
      limit,
      page,
      sorts,
      statuses,
      taskName,
      variant,
    },
    versionId: childPatchId,
  };

  const { baseStatusesInputVal, currentStatusesInputVal } = state;
  const { baseStatuses: currentBaseStatuses, currentStatuses } =
    useTaskStatuses({
      versionId: childPatchId,
    });

  const taskNameInputProps = {
    onChange: ({ target }) =>
      dispatch({ task: target.value, type: "onChangeTaskNameInput" }),
    onFilter: () => dispatch({ type: "onFilterTaskNameInput" }),
    placeholder: "Task name",
    value: state.taskNameInputVal,
  };

  const variantInputProps = {
    onChange: ({ target }) =>
      dispatch({
        type: "onChangeVariantInput",
        variant: target.value,
      }),
    onFilter: () => dispatch({ type: "onFilterVariantInput" }),
    placeholder: "Variant name",
    value: state.variantInputVal,
  };

  const baseStatusSelectorProps = {
    onChange: (s: string[]) =>
      dispatch({ baseStatuses: s, type: "setAndSubmitBaseStatusesSelector" }),
    state: baseStatusesInputVal,
    tData: currentBaseStatuses,
  };

  const statusSelectorProps = {
    onChange: (s: string[]) =>
      dispatch({
        statuses: s,
        type: "setAndSubmitStatusesSelector",
      }),
    state: currentStatusesInputVal,
    tData: currentStatuses,
  };

  const { data, refetch, startPolling, stopPolling } = useQuery<
    VersionTasksQuery,
    VersionTasksQueryVariables
  >(GET_VERSION_TASKS, {
    fetchPolicy: "cache-and-network",
    onError: (err) => {
      dispatchToast.error(`Error fetching downstream tasks ${err}`);
    },
    variables,
  });
  usePolling({ refetch, startPolling, stopPolling });
  const showSkeleton = !data;
  const { version } = data || {};
  const { isPatch, tasks } = version || {};
  const { count = 0, data: tasksData = [] } = tasks || {};

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
      sorts: parseSortString(toSortString(sorter)),
      type: "onSort",
    });

  return (
    <Wrapper data-cy="project-accordion">
      <Accordion
        defaultOpen={status === PatchStatus.Failed}
        title={variantTitle}
        titleTag={FlexContainer}
        subtitle={
          <DownstreamMetadata
            baseVersionID={baseVersionID}
            githash={githash}
            parameters={parameters}
          />
        }
      >
        <AccordionContents>
          <TableWrapper
            controls={
              <TableControl
                filteredCount={count}
                totalCount={taskCount}
                label="tasks"
                onClear={() => dispatch({ type: "clearAllFilters" })}
                onPageChange={(p) => {
                  dispatch({ page: p, type: "onChangePagination" });
                }}
                onPageSizeChange={(l) => {
                  dispatch({ limit: l, type: "onChangeLimit" });
                }}
                limit={limit}
                page={page}
              />
            }
          >
            {showSkeleton ? (
              <Skeleton active title={false} paragraph={{ rows: 8 }} />
            ) : (
              <TasksTable
                baseStatusSelectorProps={baseStatusSelectorProps}
                isPatch={isPatch}
                onColumnHeaderClick={(sortField) =>
                  sendEvent({
                    name: "Sort Downstream Tasks Table",
                    sortBy: sortField,
                  })
                }
                sorts={sorts}
                statusSelectorProps={statusSelectorProps}
                tableChangeHandler={tableChangeHandler}
                taskNameInputProps={taskNameInputProps}
                tasks={tasksData}
                variantInputProps={variantInputProps}
              />
            )}
          </TableWrapper>
        </AccordionContents>
      </Accordion>
    </Wrapper>
  );
};
interface DownstreamMetadataProps {
  baseVersionID: string;
  githash: string;
  parameters: Parameter[];
}
const DownstreamMetadata: React.VFC<DownstreamMetadataProps> = ({
  baseVersionID,
  githash,
  parameters,
}) => (
  <FlexRow>
    <PaddedText>
      Base commit:{" "}
      <InlineCode
        as={Link}
        data-cy="downstream-base-commit"
        to={getVersionRoute(baseVersionID)}
      >
        {shortenGithash(githash)}
      </InlineCode>
    </PaddedText>
    <ParametersModal parameters={parameters} />
  </FlexRow>
);

const PaddedText = styled.p`
  margin-right: ${size.xs};
`;
const ProjectTitleWrapper = styled.div`
  margin-right: ${size.xs};
  font-weight: bold;
`;

const AccordionContents = styled.div`
  margin: ${size.s} 0;
`;

const FlexContainer = styled.div`
  display: flex;
  align-items: center;
`;

const FlexRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const Wrapper = styled.div`
  margin: ${size.xs} 0;
`;
