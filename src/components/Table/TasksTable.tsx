import { Table } from "antd";
import { ColumnProps } from "antd/es/table";
import { SortOrder as antSortOrder } from "antd/lib/table/interface";
import { StyledRouterLink } from "components/styles";
import TaskStatusBadge from "components/TaskStatusBadge";
import { TreeSelect, TreeSelectProps } from "components/TreeSelect";
import { WordBreak } from "components/Typography";
import { getTaskRoute } from "constants/routes";
import {
  Task,
  SortDirection,
  TaskSortCategory,
  SortOrder,
} from "gql/generated/types";
import { TableOnChange } from "types/task";
import { sortTasks } from "utils/statuses";

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
};

interface TasksTableProps {
  baseStatusSelectorProps?: TreeSelectProps;
  onClickTaskLink?: (taskId: string) => void;
  onExpand?: (expanded: boolean) => void;
  sorts?: SortOrder[];
  statusSelectorProps?: TreeSelectProps;
  tableChangeHandler?: TableOnChange<TaskTableInfo>;
  tasks: TaskTableInfo[];
}

export const TasksTable: React.FC<TasksTableProps> = ({
  baseStatusSelectorProps,
  onClickTaskLink = () => {},
  onExpand = () => {},
  sorts,
  statusSelectorProps,
  tableChangeHandler,
  tasks,
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
            baseStatusSelectorProps,
            statusSelectorProps,
          })
        : getColumnDefs({
            onClickTaskLink,
            baseStatusSelectorProps,
            statusSelectorProps,
          })
    }
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
  baseStatusSelectorProps?: TreeSelectProps;
  statusSelectorProps?: TreeSelectProps;
}

const getColumnDefs = ({
  onClickTaskLink,
  baseStatusSelectorProps,
  statusSelectorProps,
}: GetColumnDefsParams): ColumnProps<Task>[] => [
  {
    title: "Name",
    dataIndex: "displayName",
    key: TaskSortCategory.Name,
    sorter: {
      compare: (a, b) => a.displayName.localeCompare(b.displayName),
      multiple: 4,
    },
    width: "40%",
    className: "cy-task-table-col-NAME",
    render: (name: string, { id }: Task): JSX.Element => (
      <TaskLink onClick={onClickTaskLink} taskName={name} taskId={id} />
    ),
  },
  {
    title: "Patch Status",
    dataIndex: "status",
    key: TaskSortCategory.Status,
    sorter: {
      compare: (a, b) => sortTasks(a.status, b.status),
      multiple: 4,
    },
    className: "cy-task-table-col-STATUS",
    render: (status: string) => status && <TaskStatusBadge status={status} />,
    ...(statusSelectorProps && {
      filterDropdown: <TreeSelect isDropdown {...statusSelectorProps} />,
    }),
  },
  {
    title: "Base Status",
    dataIndex: ["baseTask", "status"],
    key: TaskSortCategory.BaseStatus,
    sorter: {
      compare: (a, b) => sortTasks(a.baseStatus, b.baseStatus),
      multiple: 4,
    },
    className: "cy-task-table-col-BASE_STATUS",
    render: (status: string) => status && <TaskStatusBadge status={status} />,
    ...(baseStatusSelectorProps && {
      filterDropdown: <TreeSelect isDropdown {...baseStatusSelectorProps} />,
    }),
  },
  {
    title: "Variant",
    dataIndex: "buildVariantDisplayName",
    key: TaskSortCategory.Variant,
    sorter: {
      compare: (a, b) => a.buildVariant.localeCompare(b.buildVariant),
      multiple: 4,
    },
    className: "cy-task-table-col-VARIANT",
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
  baseStatusSelectorProps,
  statusSelectorProps,
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
    baseStatusSelectorProps,
    statusSelectorProps,
  }).map((columnDef) => ({
    ...columnDef,
    ...sortProps[columnDef.key],
  }));
};

interface TaskLinkProps {
  taskId: string;
  taskName: string;
  onClick: (taskId: string) => void;
}
const TaskLink: React.FC<TaskLinkProps> = ({ taskId, taskName, onClick }) => (
  <StyledRouterLink onClick={() => onClick(taskId)} to={getTaskRoute(taskId)}>
    <WordBreak>{taskName}</WordBreak>
  </StyledRouterLink>
);

const rowKey = ({ id }: { id: string }): string => id;
