import { Table } from "antd";
import { ColumnProps } from "antd/es/table";
import { SortOrder as antSortOrder } from "antd/lib/table/interface";
import { StyledRouterLink } from "components/styles";
import TaskStatusBadge from "components/TaskStatusBadge";
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
  tasks: TaskTableInfo[];
  tableChangeHandler?: TableOnChange<TaskTableInfo>;
  onExpand?: (expanded: boolean) => void;
  onClickTaskLink?: (taskId: string) => void;
  sorts?: SortOrder[];
}
export const TasksTable: React.FC<TasksTableProps> = ({
  tasks,
  tableChangeHandler,
  onExpand = () => {},
  onClickTaskLink = () => {},
  sorts,
}) => (
  <Table
    data-cy="tasks-table"
    rowKey={rowKey}
    pagination={false}
    columns={
      sorts
        ? getColumnDefsWithSort(sorts, onClickTaskLink)
        : getColumnDefs(onClickTaskLink)
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

const getColumnDefs = (onClickTaskLink): ColumnProps<Task>[] => [
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

const getColumnDefsWithSort = (
  sortOrders: SortOrder[],
  onClickTaskLink: (taskId: string) => void
): ColumnProps<Task>[] => {
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

  const sortProps = {
    [TaskSortCategory.Name]: {
      sortOrder: getSortDir(TaskSortCategory.Name, sortOrders),
    },
    [TaskSortCategory.Status]: {
      sortOrder: getSortDir(TaskSortCategory.Status, sortOrders),
    },
    [TaskSortCategory.BaseStatus]: {
      sortOrder: getSortDir(TaskSortCategory.BaseStatus, sortOrders),
    },
    [TaskSortCategory.Variant]: {
      sortOrder: getSortDir(TaskSortCategory.Variant, sortOrders),
    },
  };

  return getColumnDefs(onClickTaskLink).map((columnDef) => ({
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
