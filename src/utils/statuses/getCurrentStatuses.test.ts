import { TreeDataEntry } from "components/TreeSelect";
import { TaskStatus } from "types/task";
import { getCurrentStatuses } from "utils/statuses";

describe("getCurrentStatuses", () => {
  it("matches status keys to status tree data", () => {
    const statuses = [
      TaskStatus.Failed,
      TaskStatus.Succeeded,
      TaskStatus.Dispatched,
    ];
    expect(getCurrentStatuses(statuses, statusesTreeData)).toStrictEqual([
      {
        key: "all",
        title: "All",
        value: "all",
      },
      {
        key: TaskStatus.Failed,
        title: "Failed",
        value: TaskStatus.Failed,
      },
      {
        key: TaskStatus.Succeeded,
        title: "Success",
        value: TaskStatus.Succeeded,
      },
      {
        key: TaskStatus.Dispatched,
        title: "Running",
        value: TaskStatus.Dispatched,
      },
    ]);
  });

  it("returns only All for no statuses", () => {
    expect(getCurrentStatuses([], statusesTreeData)).toStrictEqual([
      {
        key: "all",
        title: "All",
        value: "all",
      },
    ]);
  });

  it("returns one child status if parent only has one matching child", () => {
    const statuses = [
      TaskStatus.TestTimedOut,
      TaskStatus.Undispatched,
      TaskStatus.SystemFailed,
    ];
    expect(getCurrentStatuses(statuses, statusesTreeData)).toStrictEqual([
      {
        key: "all",
        title: "All",
        value: "all",
      },
      {
        key: TaskStatus.TestTimedOut,
        title: "Test Timed Out",
        value: TaskStatus.TestTimedOut,
      },
      {
        key: TaskStatus.Undispatched,
        title: "Undispatched",
        value: TaskStatus.Undispatched,
      },
      {
        key: TaskStatus.SystemFailed,
        title: "System Failed",
        value: TaskStatus.SystemFailed,
      },
    ]);
  });

  it("returns child statuses as parent's children if there are two or more", () => {
    const statuses = [TaskStatus.Failed, TaskStatus.TestTimedOut];
    expect(getCurrentStatuses(statuses, statusesTreeData)).toStrictEqual([
      {
        key: "all",
        title: "All",
        value: "all",
      },
      {
        children: [
          {
            key: TaskStatus.Failed,
            title: "Failed",
            value: TaskStatus.Failed,
          },
          {
            key: TaskStatus.TestTimedOut,
            title: "Test Timed Out",
            value: TaskStatus.TestTimedOut,
          },
        ],
        key: "all-failures",
        title: "Failures",
        value: "all-failures",
      },
    ]);
  });
});

const statusesTreeData: TreeDataEntry[] = [
  {
    key: "all",
    title: "All",
    value: "all",
  },
  {
    children: [
      {
        key: TaskStatus.Failed,
        title: "Failed",
        value: TaskStatus.Failed,
      },
      {
        key: TaskStatus.TestTimedOut,
        title: "Test Timed Out",
        value: TaskStatus.TestTimedOut,
      },
    ],
    key: "all-failures",
    title: "Failures",
    value: "all-failures",
  },
  {
    key: TaskStatus.Succeeded,
    title: "Success",
    value: TaskStatus.Succeeded,
  },
  {
    key: TaskStatus.Dispatched,
    title: "Running",
    value: TaskStatus.Dispatched,
  },
  {
    key: TaskStatus.Started,
    title: "Started",
    value: TaskStatus.Started,
  },
  {
    children: [
      {
        key: TaskStatus.Unstarted,
        title: "Unstarted",
        value: TaskStatus.Unstarted,
      },
      {
        key: TaskStatus.Undispatched,
        title: "Undispatched",
        value: TaskStatus.Undispatched,
      },
    ],
    key: "scheduled",
    title: "Scheduled",
    value: "scheduled",
  },
  {
    children: [
      {
        key: TaskStatus.SystemFailed,
        title: "System Failed",
        value: TaskStatus.SystemFailed,
      },
    ],
    key: "system-issues",
    title: "System Issues",
    value: "system-issues",
  },
  {
    key: TaskStatus.SetupFailed,
    title: "Setup Failed",
    value: TaskStatus.SetupFailed,
  },
  {
    key: TaskStatus.Blocked,
    title: "Blocked",
    value: TaskStatus.Blocked,
  },
  {
    key: TaskStatus.Inactive,
    title: "Won't Run",
    value: TaskStatus.Inactive,
  },
];
