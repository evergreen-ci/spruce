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

// Type needed to render the task table
type TaskTableInfo = {
  id: string;
  displayName: string;
  status: string;
  baseTask?: {
    status: string;
  };
  buildVariantDisplayName?: string;
  executionTasksFull?: TaskTableInfo[];
  projectIdentifier?: string;
};

interface TasksTableProps {
  baseStatusSelectorProps?: TreeSelectProps;
  onClickTaskLink?: (taskId: string) => void;
  onExpand?: (expanded: boolean) => void;
  sorts?: SortOrder[];
  statusSelectorProps?: TreeSelectProps;
  onColumnHeaderClick?: (sortField) => void;
  tableChangeHandler?: TableOnChange<TaskTableInfo>;
  tasks: TaskTableInfo[];
  taskNameInputProps?: InputFilterProps;
  variantInputProps?: InputFilterProps;
}

export const TasksTable: React.VFC<TasksTableProps> = ({
  baseStatusSelectorProps,
  taskNameInputProps,
  onClickTaskLink = () => {},
  onExpand = () => {},
  sorts,
  statusSelectorProps,
  onColumnHeaderClick,
  tableChangeHandler,
  tasks,
  variantInputProps,
}) => (
  <Table
    data-cy="tasks-table"
    rowKey={rowKey}
    pagination={false}
    columns={
      sorts
        ? getColumnDefsWithSort({
            sorts,
            onClickTaskLink,
            onColumnHeaderClick,
            baseStatusSelectorProps,
            statusSelectorProps,
            taskNameInputProps,
            variantInputProps,
          })
        : getColumnDefs({
            onClickTaskLink,
            onColumnHeaderClick,
            baseStatusSelectorProps,
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
  onClickTaskLink: (s: string) => void;
  onColumnHeaderClick?: (sortField) => void;
  baseStatusSelectorProps?: TreeSelectProps;
  statusSelectorProps?: TreeSelectProps;
  taskNameInputProps?: InputFilterProps;
  variantInputProps?: InputFilterProps;
}

const getColumnDefs = ({
  onClickTaskLink,
  onColumnHeaderClick = () => undefined,
  baseStatusSelectorProps,
  statusSelectorProps,
  variantInputProps,
  taskNameInputProps,
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
    render: (name: string, { id }: Task): JSX.Element => (
      <TaskLink onClick={onClickTaskLink} taskName={name} taskId={id} />
    ),
    ...(taskNameInputProps &&
      getColumnSearchFilterProps({
        ...taskNameInputProps,
        "data-cy": "taskname-input",
      })),
  },
  {
    title: "Patch Status",
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
    render: (status: string) => status && <TaskStatusBadge status={status} />,
    ...(statusSelectorProps && {
      ...getColumnTreeSelectFilterProps({
        ...statusSelectorProps,
        "data-cy": "status-treeselect",
      }),
    }),
  },
  {
    title: "Base Status",
    dataIndex: ["baseTask", "status"],
    key: TaskSortCategory.BaseStatus,
    onHeaderCell: () => ({
      onClick: () => {
        onColumnHeaderClick(TaskSortCategory.BaseStatus);
      },
    }),
    sorter: {
      compare: (a, b) => sortTasks(a.baseStatus, b.baseStatus),
      multiple: 4,
    },
    className: "cy-task-table-col-BASE_STATUS",
    render: (status: string) => status && <TaskStatusBadge status={status} />,
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
    render: (displayName, { projectIdentifier, buildVariant }) => (
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
  sorts: SortOrder[]
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
  sorts,
  onClickTaskLink,
  onColumnHeaderClick,
  baseStatusSelectorProps,
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
    onClickTaskLink,
    onColumnHeaderClick,
    baseStatusSelectorProps,
    statusSelectorProps,
    taskNameInputProps,
    variantInputProps,
  }).map((columnDef) => ({
    ...columnDef,
    ...sortProps[columnDef.key],
  }));
};

const rowKey = ({ id }: { id: string }): string => id;
