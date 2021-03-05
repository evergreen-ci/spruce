import { Table } from "antd";
import { ColumnProps } from "antd/es/table";
import { SortOrder as antSortOrder } from "antd/lib/table/interface";
import { ErrorBoundary } from "components/ErrorBoundary";
import { StyledRouterLink } from "components/styles";
import { TaskStatusBadge } from "components/TaskStatusBadge";
import { WordBreak } from "components/Typography";
import { getTaskRoute } from "constants/routes";
import {
  TaskResult,
  SortDirection,
  TaskSortCategory,
  SortOrder,
} from "gql/generated/types";
import { TableOnChange } from "types/task";

interface TasksTableProps {
  tasks: any;
  tableChangeHandler?: TableOnChange<TaskResult>;
  onExpand?: (expanded: boolean) => void;
  onClickTaskLink?: (taskId: string) => void;
  sorts?: SortOrder[];
}
export const TasksTable: React.FC<TasksTableProps> = ({
  tasks,
  tableChangeHandler,
  onExpand,
  onClickTaskLink,
  sorts,
}) => (
  <Table
    data-cy="tasks-table"
    rowKey={rowKey}
    pagination={false}
    columns={
      sorts
        ? getColumnDefsControlled(sorts, onClickTaskLink)
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

const getColumnDefs = (onClickTaskLink): ColumnProps<TaskResult>[] => [
  {
    title: "Name",
    dataIndex: "displayName",
    key: TaskSortCategory.Name,
    sorter: (a, b) => a.displayName.localeCompare(b.displayName),
    width: "40%",
    className: "cy-task-table-col-NAME",
    render: (name: string, { id }: TaskResult): JSX.Element => (
      <TaskLink onClick={onClickTaskLink} taskName={name} taskId={id} />
    ),
  },
  {
    title: "Patch Status",
    dataIndex: "status",
    key: TaskSortCategory.Status,
    sorter: (a, b) => a.status.localeCompare(b.status),
    className: "cy-task-table-col-STATUS",
    render: renderStatusBadge,
  },
  {
    title: "Base Status",
    dataIndex: "baseStatus",
    key: TaskSortCategory.BaseStatus,
    sorter: (a, b) => a.baseStatus?.localeCompare(b.baseStatus),
    className: "cy-task-table-col-BASE_STATUS",
    render: renderStatusBadge,
  },
  {
    title: "Variant",
    dataIndex: "buildVariant",
    key: TaskSortCategory.Variant,
    sorter: (a, b) => a.buildVariant.localeCompare(b.buildVariant),
    className: "cy-task-table-col-VARIANT",
  },
];

const getColumnDefsControlled = (
  sortOrder: SortOrder[],
  onClickTaskLink: (taskId: string) => void
): ColumnProps<TaskResult>[] => {
  const getSortDir = (
    key: string,
    sorts: SortOrder[]
  ): antSortOrder | undefined => {
    for (let i = 0; i < sorts.length; i++) {
      if (sorts[i].Key === key) {
        return sorts[i].Direction === SortDirection.Desc ? "descend" : "ascend";
      }
    }
    return undefined;
  };
  const sortProps = [
    {
      sorter: {
        multiple: 4,
      },
      sortOrder: getSortDir(TaskSortCategory.Name, sortOrder),
    },
    {
      sorter: {
        multiple: 4,
      },
      sortOrder: getSortDir(TaskSortCategory.Status, sortOrder),
    },
    {
      dataIndex: ["baseTask", "status"],
      sorter: {
        multiple: 4,
      },
      sortOrder: getSortDir(TaskSortCategory.BaseStatus, sortOrder),
    },
    {
      sorter: {
        multiple: 4,
      },
      sortOrder: getSortDir(TaskSortCategory.Variant, sortOrder),
    },
  ];

  return getColumnDefs(onClickTaskLink).map((columnDef, i) => ({
    ...columnDef,
    ...sortProps[i],
  }));
};

const renderStatusBadge = (
  status: string,
  { blocked }: TaskResult
): null | JSX.Element => {
  if (status === "" || !status) {
    return null;
  }
  return (
    <ErrorBoundary>
      <TaskStatusBadge status={status} blocked={blocked} />
    </ErrorBoundary>
  );
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
