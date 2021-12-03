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
        title: "All",
        value: "all",
        key: "all",
      },
      {
        title: "Failed",
        value: TaskStatus.Failed,
        key: TaskStatus.Failed,
      },
      {
        title: "Success",
        value: TaskStatus.Succeeded,
        key: TaskStatus.Succeeded,
      },
      {
        title: "Running",
        value: TaskStatus.Dispatched,
        key: TaskStatus.Dispatched,
      },
    ]);
  });

  it("returns only All for no statuses", () => {
    expect(getCurrentStatuses([], statusesTreeData)).toStrictEqual([
      {
        title: "All",
        value: "all",
        key: "all",
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
        title: "All",
        value: "all",
        key: "all",
      },
      {
        title: "Test Timed Out",
        value: TaskStatus.TestTimedOut,
        key: TaskStatus.TestTimedOut,
      },
      {
        title: "Undispatched",
        value: TaskStatus.Undispatched,
        key: TaskStatus.Undispatched,
      },
      {
        title: "System Failed",
        value: TaskStatus.SystemFailed,
        key: TaskStatus.SystemFailed,
      },
    ]);
  });

  it("returns child statuses as parent's children if there are two or more", () => {
    const statuses = [TaskStatus.Failed, TaskStatus.TestTimedOut];
    expect(getCurrentStatuses(statuses, statusesTreeData)).toStrictEqual([
      {
        title: "All",
        value: "all",
        key: "all",
      },
      {
        title: "Failures",
        value: "all-failures",
        key: "all-failures",
        children: [
          {
            title: "Failed",
            value: TaskStatus.Failed,
            key: TaskStatus.Failed,
          },
          {
            title: "Test Timed Out",
            value: TaskStatus.TestTimedOut,
            key: TaskStatus.TestTimedOut,
          },
        ],
      },
    ]);
  });
});

const statusesTreeData: TreeDataEntry[] = [
  {
    title: "All",
    value: "all",
    key: "all",
  },
  {
    title: "Failures",
    value: "all-failures",
    key: "all-failures",
    children: [
      {
        title: "Failed",
        value: TaskStatus.Failed,
        key: TaskStatus.Failed,
      },
      {
        title: "Test Timed Out",
        value: TaskStatus.TestTimedOut,
        key: TaskStatus.TestTimedOut,
      },
    ],
  },
  {
    title: "Success",
    value: TaskStatus.Succeeded,
    key: TaskStatus.Succeeded,
  },
  {
    title: "Running",
    value: TaskStatus.Dispatched,
    key: TaskStatus.Dispatched,
  },
  {
    title: "Started",
    value: TaskStatus.Started,
    key: TaskStatus.Started,
  },
  {
    title: "Scheduled",
    value: "scheduled",
    key: "scheduled",
    children: [
      {
        title: "Unstarted",
        value: TaskStatus.Unstarted,
        key: TaskStatus.Unstarted,
      },
      {
        title: "Undispatched",
        value: TaskStatus.Undispatched,
        key: TaskStatus.Undispatched,
      },
    ],
  },
  {
    title: "System Issues",
    value: "system-issues",
    key: "system-issues",
    children: [
      {
        title: "System Failed",
        value: TaskStatus.SystemFailed,
        key: TaskStatus.SystemFailed,
      },
    ],
  },
  {
    title: "Setup Failed",
    value: TaskStatus.SetupFailed,
    key: TaskStatus.SetupFailed,
  },
  {
    title: "Blocked",
    value: TaskStatus.Blocked,
    key: TaskStatus.Blocked,
  },
  {
    title: "Won't Run",
    value: TaskStatus.Inactive,
    key: TaskStatus.Inactive,
  },
];
