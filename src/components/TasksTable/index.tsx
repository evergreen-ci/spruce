import { Table } from "antd";
import { ColumnProps } from "antd/es/table";
import { SortOrder as antSortOrder } from "antd/lib/table/interface";
import { ConditionalWrapper } from "components/ConditionalWrapper";
import { StyledRouterLink } from "components/styles";
import {
  InputFilterProps,
  getColumnSearchFilterProps,
  getColumnTreeSelectFilterProps,
} from "components/Table/Filters";
import TaskStatusBadge from "components/TaskStatusBadge";
import { TreeSelectProps } from "components/TreeSelect";
import { getVariantHistoryRoute } from "constants/routes";
import { mergeTaskVariant } from "constants/task";
import {
  Task,
  SortDirection,
  SortOrder,
  TaskSortCategory,
} from "gql/generated/types";
import { TableOnChange } from "types/task";
import { sortTasks } from "utils/statuses";
import { TaskLink } from "./TaskLink";

type TaskTableInfo = {
  baseTask?: {
    status: string;
  };
  buildVariantDisplayName?: string;
  displayName: string;
  executionTasksFull?: TaskTableInfo[];
  id: string;
  projectIdentifier?: string;
  status: string;
};

interface TasksTableProps {
  baseStatusSelectorProps?: TreeSelectProps;
  isPatch: boolean;
  loading?: boolean;
  onClickTaskLink?: (taskId: string) => void;
  onColumnHeaderClick?: (sortField) => void;
  onExpand?: (expanded: boolean) => void;
  showTaskExecutionLabel?: boolean;
  sorts?: SortOrder[];
  statusSelectorProps?: TreeSelectProps;
  tableChangeHandler?: TableOnChange<TaskTableInfo>;
  taskNameInputProps?: InputFilterProps;
  tasks: TaskTableInfo[];
  variantInputProps?: InputFilterProps;
}

const TasksTable: React.FC<TasksTableProps> = ({
  baseStatusSelectorProps,
  isPatch,
  loading = false,
  onClickTaskLink = () => {},
  onColumnHeaderClick,
  onExpand = () => {},
  showTaskExecutionLabel,
  sorts,
  statusSelectorProps,
  tableChangeHandler,
  taskNameInputProps,
  tasks,
  variantInputProps,
}) => (
  <Table
    data-cy="tasks-table"
    rowKey={rowKey}
    pagination={false}
    loading={loading}
    data-loading={loading}
    columns={
      sorts
        ? getColumnDefsWithSort({
            baseStatusSelectorProps,
            isPatch,
            onClickTaskLink,
            onColumnHeaderClick,
            showTaskExecutionLabel,
            sorts,
            statusSelectorProps,
            taskNameInputProps,
            variantInputProps,
          })
        : getColumnDefs({
            baseStatusSelectorProps,
            isPatch,
            onClickTaskLink,
            onColumnHeaderClick,
            showTaskExecutionLabel,
            statusSelectorProps,
            taskNameInputProps,
            variantInputProps,
          })
    }
    getPopupContainer={(trigger: HTMLElement) => trigger}
    dataSource={tasks}
    onChange={tableChangeHandler}
    childrenColumnName="executionTasksFull"
    expandable={{
      onExpand: (expanded) => {
        onExpand(expanded);
      },
    }}
  />
);

interface GetColumnDefsParams {
  baseStatusSelectorProps?: TreeSelectProps;
  isPatch: boolean;
  onClickTaskLink: (s: string) => void;
  onColumnHeaderClick?: (sortField) => void;
  showTaskExecutionLabel?: boolean;
  statusSelectorProps?: TreeSelectProps;
  taskNameInputProps?: InputFilterProps;
  variantInputProps?: InputFilterProps;
}

const getColumnDefs = ({
  baseStatusSelectorProps,
  isPatch,
  onClickTaskLink,
  onColumnHeaderClick = () => undefined,
  showTaskExecutionLabel,
  statusSelectorProps,
  taskNameInputProps,
  variantInputProps,
}: GetColumnDefsParams): ColumnProps<Task>[] => [
  {
    title: "Name",
    dataIndex: "displayName",
    key: TaskSortCategory.Name,
    onHeaderCell: () => ({
      onClick: () => {
        onColumnHeaderClick(TaskSortCategory.Name);
      },
    }),
    sorter: {
      compare: (a, b) => a.displayName.localeCompare(b.displayName),
      multiple: 4,
    },
    width: "40%",
    className: "cy-task-table-col-NAME",
    render: (name: string, { execution, id }: Task): JSX.Element => (
      <TaskLink
        execution={execution}
        onClick={onClickTaskLink}
        showTaskExecutionLabel={showTaskExecutionLabel}
        taskId={id}
        taskName={name}
      />
    ),
    ...(taskNameInputProps &&
      getColumnSearchFilterProps({
        ...taskNameInputProps,
        "data-cy": "taskname-input",
      })),
  },
  {
    title: "Task Status",
    dataIndex: "status",
    key: TaskSortCategory.Status,
    onHeaderCell: () => ({
      onClick: () => {
        onColumnHeaderClick(TaskSortCategory.Status);
      },
    }),
    sorter: {
      compare: (a, b) => sortTasks(a.status, b.status),
      multiple: 4,
    },
    className: "cy-task-table-col-STATUS",
    render: (status: string, { execution, id }) =>
      status && (
        <TaskStatusBadge status={status} id={id} execution={execution} />
      ),
    ...(statusSelectorProps && {
      ...getColumnTreeSelectFilterProps({
        ...statusSelectorProps,
        "data-cy": "status-treeselect",
      }),
    }),
  },
  {
    title: `${isPatch ? "Base" : "Previous"} Status`,
    dataIndex: ["baseTask", "status"],
    key: TaskSortCategory.BaseStatus,
    onHeaderCell: () => ({
      onClick: () => {
        onColumnHeaderClick(TaskSortCategory.BaseStatus);
      },
    }),
    sorter: {
      compare: (a, b) => sortTasks(a?.baseTask?.status, b?.baseTask?.status),
      multiple: 4,
    },
    className: "cy-task-table-col-BASE_STATUS",
    render: (status: string, { baseTask }) =>
      status && (
        <TaskStatusBadge
          status={status}
          id={baseTask.id}
          execution={baseTask.execution}
        />
      ),
    ...(baseStatusSelectorProps && {
      ...getColumnTreeSelectFilterProps({
        ...baseStatusSelectorProps,
        "data-cy": "base-status-treeselect",
      }),
    }),
  },
  {
    title: "Variant",
    dataIndex: "buildVariantDisplayName",
    key: TaskSortCategory.Variant,
    onHeaderCell: () => ({
      onClick: () => {
        onColumnHeaderClick(TaskSortCategory.Variant);
      },
    }),
    sorter: {
      compare: (a, b) => a.buildVariant.localeCompare(b.buildVariant),
      multiple: 4,
    },
    className: "cy-task-table-col-VARIANT",
    ...(variantInputProps &&
      getColumnSearchFilterProps({
        ...variantInputProps,
        "data-cy": "variant-input",
      })),
    render: (displayName, { buildVariant, projectIdentifier }) => (
      <ConditionalWrapper
        condition={buildVariant !== mergeTaskVariant}
        wrapper={(children) => (
          <StyledRouterLink
            to={getVariantHistoryRoute(projectIdentifier, buildVariant)}
          >
            {children}
          </StyledRouterLink>
        )}
      >
        {displayName}
      </ConditionalWrapper>
    ),
  },
];

const getSortDir = (
  key: string,
  sorts: SortOrder[],
): antSortOrder | undefined => {
  const sortKey = sorts.find((sort) => sort.Key === key);
  if (sortKey) {
    return sortKey.Direction === SortDirection.Desc ? "descend" : "ascend";
  }
  return undefined;
};

interface GetColumnDefsWithSort extends GetColumnDefsParams {
  sorts: SortOrder[];
}

const getColumnDefsWithSort = ({
  baseStatusSelectorProps,
  isPatch,
  onClickTaskLink,
  onColumnHeaderClick,
  showTaskExecutionLabel,
  sorts,
  statusSelectorProps,
  taskNameInputProps,
  variantInputProps,
}: GetColumnDefsWithSort): ColumnProps<Task>[] => {
  const sortProps = {
    [TaskSortCategory.Name]: {
      sortOrder: getSortDir(TaskSortCategory.Name, sorts),
    },
    [TaskSortCategory.Status]: {
      sortOrder: getSortDir(TaskSortCategory.Status, sorts),
    },
    [TaskSortCategory.BaseStatus]: {
      sortOrder: getSortDir(TaskSortCategory.BaseStatus, sorts),
    },
    [TaskSortCategory.Variant]: {
      sortOrder: getSortDir(TaskSortCategory.Variant, sorts),
    },
  };

  return getColumnDefs({
    baseStatusSelectorProps,
    isPatch,
    onClickTaskLink,
    onColumnHeaderClick,
    showTaskExecutionLabel,
    statusSelectorProps,
    taskNameInputProps,
    variantInputProps,
  }).map((columnDef) => ({
    ...columnDef,
    ...sortProps[columnDef.key],
  }));
};

const rowKey = ({ id }: { id: string }): string => id;

export default TasksTable;
