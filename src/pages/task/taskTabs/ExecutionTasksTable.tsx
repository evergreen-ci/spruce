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
import { useQueryParam } from "hooks/useQueryParam";
import { useUpdateURLQueryParams } from "hooks/useUpdateURLQueryParams";

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

  const [sortBy] = useQueryParam(TableQueryParams.SortBy, "");
  const [sortDir] = useQueryParam(TableQueryParams.SortDir, "");

  // Apply default sort if none is defined.
  useEffect(() => {
    if (!sortBy && !sortDir) {
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
      },
      initialState: {
        sorting:
          sortBy && sortDir
            ? [
                {
                  id: sortBy as TaskSortCategory,
                  desc: sortDir === SortDirection.Desc,
                },
              ]
            : [{ id: TaskSortCategory.Status, desc: false }],
      },
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
