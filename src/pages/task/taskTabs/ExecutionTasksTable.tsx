import { useEffect, useMemo, useRef } from "react";
import { LeafyGreenTable, useLeafyGreenTable } from "@leafygreen-ui/table";
import { SortingState, Sorting } from "@tanstack/react-table";
import { useTaskAnalytics } from "analytics";
import { BaseTable } from "components/Table/BaseTable";
import { TablePlaceholder } from "components/Table/TablePlaceholder";
import { TableQueryParams, onChangeHandler } from "components/Table/utils";
import { getColumnsTemplate } from "components/TasksTable/Columns";
import { TaskTableInfo } from "components/TasksTable/types";
import {
  TaskQuery,
  TaskSortCategory,
  SortDirection,
} from "gql/generated/types";
import { useTableSort } from "hooks";
import { useQueryParams } from "hooks/useQueryParam";
import { useUpdateURLQueryParams } from "hooks/useUpdateURLQueryParams";
import { parseSortString } from "utils/queryString";

const { getDefaultOptions: getDefaultSorting } = Sorting;

interface Props {
  execution: number;
  executionTasksFull: TaskQuery["task"]["executionTasksFull"];
  isPatch: boolean;
}

export const ExecutionTasksTable: React.FC<Props> = ({
  execution,
  executionTasksFull,
  isPatch,
}) => {
  const { sendEvent } = useTaskAnalytics();
  const updateQueryParams = useUpdateURLQueryParams();

  const [queryParams] = useQueryParams();
  const sortBy = queryParams[TableQueryParams.SortBy] as string;
  const sortDir = queryParams[TableQueryParams.SortDir] as string;
  const sorts = queryParams[TableQueryParams.Sorts] as string;

  // Apply default sort if no sorting method is defined.
  useEffect(() => {
    if (!sorts && !sortBy && !sortDir) {
      updateQueryParams({
        sortBy: TaskSortCategory.Status,
        sortDir: SortDirection.Asc,
      });
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const uniqueExecutions = new Set([
    execution,
    ...executionTasksFull.map((t) => t.execution),
  ]);

  const initialSorting = useMemo(
    () => getInitialSorting(queryParams),
    [], // eslint-disable-line react-hooks/exhaustive-deps
  );

  const columns = useMemo(
    () =>
      getColumnsTemplate({
        isPatch,
        onClickTaskLink: () => sendEvent({ name: "Click Execution Task Link" }),
        showTaskExecutionLabel: uniqueExecutions.size > 1,
      }),
    [isPatch, sendEvent, uniqueExecutions.size],
  );

  const tableSortHandler = useTableSort({
    sendAnalyticsEvents: (sorter: SortingState) =>
      sendEvent({
        name: "Sort Execution Tasks Table",
        sortBy: sorter.map(({ id }) => id as TaskSortCategory),
      }),
  });

  const tableContainerRef = useRef<HTMLDivElement>(null);
  const table: LeafyGreenTable<TaskTableInfo> =
    useLeafyGreenTable<TaskTableInfo>({
      columns,
      containerRef: tableContainerRef,
      data: executionTasksFull ?? [],
      defaultColumn: {
        enableColumnFilter: false,
        enableMultiSort: true,
      },
      initialState: {
        sorting: initialSorting,
      },
      isMultiSortEvent: () => true, // Override default requirement for shift-click to multisort.
      maxMultiSortColCount: 2,
      onSortingChange: onChangeHandler<SortingState>(
        (s) => getDefaultSorting(table).onSortingChange(s),
        tableSortHandler,
      ),
    });

  return (
    <BaseTable
      data-cy="execution-tasks-table"
      data-cy-row="execution-tasks-table-row"
      emptyComponent={<TablePlaceholder message="No execution tasks found." />}
      table={table}
      shouldAlternateRowColor
    />
  );
};

const getInitialSorting = (queryParams: {
  [key: string]: any;
}): SortingState => {
  const {
    [TableQueryParams.SortBy]: sortBy,
    [TableQueryParams.SortDir]: sortDir,
    [TableQueryParams.Sorts]: sorts,
  } = queryParams;

  let initialSorting = [{ id: TaskSortCategory.Status, desc: false }];
  if (sortBy && sortDir) {
    initialSorting = [
      {
        id: sortBy as TaskSortCategory,
        desc: sortDir === SortDirection.Desc,
      },
    ];
  } else if (sorts) {
    const parsedSorts = parseSortString(sorts);
    initialSorting = parsedSorts.map(({ Direction, Key }) => ({
      id: Key as TaskSortCategory,
      desc: Direction === SortDirection.Desc,
    }));
  }

  return initialSorting;
};
