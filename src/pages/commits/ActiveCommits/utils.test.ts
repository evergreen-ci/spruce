import { uiColors } from "@leafygreen-ui/palette";
import { purple } from "constants/colors";
import { taskStatusToCopy } from "constants/task";
import { fireEvent } from "test_utils";
import { TaskStatus } from "types/task";
import {
  TASK_ICON_HEIGHT,
  TASK_ICON_PADDING,
  GROUPED_BADGE_HEIGHT,
  GROUPED_BADGE_PADDING,
} from "../constants";
import {
  getAllTaskStatsGroupedByColor,
  getStatusesWithZeroCount,
  constructBuildVariantDict,
  roundMax,
  hoverTaskIcons,
} from "./utils";

const { red, green, yellow, gray } = uiColors;

describe("getAllTaskStatsGroupedByColor", () => {
  it("grab the taskStatusCounts field from all versions, returns mapping between version id to its {grouped task stats, max, total}", () => {
    expect(getAllTaskStatsGroupedByColor(versions)).toStrictEqual({
      "12": {
        stats: [
          {
            count: 8,
            statuses: [
              taskStatusToCopy[TaskStatus.TestTimedOut],
              taskStatusToCopy[TaskStatus.Failed],
            ],
            color: red.base,
            umbrellaStatus: TaskStatus.FailedUmbrella,
            statusCounts: {
              [TaskStatus.TestTimedOut]: 6,
              [TaskStatus.Failed]: 2,
            },
          },
          {
            count: 7,
            statuses: [
              taskStatusToCopy[TaskStatus.SystemTimedOut],
              taskStatusToCopy[TaskStatus.SystemUnresponsive],
            ],
            color: purple.base,
            umbrellaStatus: TaskStatus.SystemFailureUmbrella,
            statusCounts: {
              [TaskStatus.SystemTimedOut]: 5,
              [TaskStatus.SystemUnresponsive]: 2,
            },
          },
          {
            count: 4,
            statuses: [taskStatusToCopy[TaskStatus.Dispatched]],
            color: yellow.base,
            umbrellaStatus: TaskStatus.RunningUmbrella,
            statusCounts: { [TaskStatus.Dispatched]: 4 },
          },
          {
            count: 2,
            statuses: [taskStatusToCopy[TaskStatus.WillRun]],
            color: gray.base,
            umbrellaStatus: TaskStatus.ScheduledUmbrella,
            statusCounts: { [TaskStatus.WillRun]: 2 },
          },
        ],
        max: 8,
        total: 21,
      },
      "13": {
        stats: [
          {
            count: 6,
            statuses: [taskStatusToCopy[TaskStatus.Succeeded]],
            color: green.base,
            umbrellaStatus: TaskStatus.Succeeded,
            statusCounts: { [TaskStatus.Succeeded]: 6 },
          },
          {
            count: 2,
            statuses: [taskStatusToCopy[TaskStatus.Failed]],
            color: red.base,
            umbrellaStatus: TaskStatus.FailedUmbrella,
            statusCounts: { [TaskStatus.Failed]: 2 },
          },
          {
            count: 9,
            statuses: [
              taskStatusToCopy[TaskStatus.Dispatched],
              taskStatusToCopy[TaskStatus.Started],
            ],
            color: yellow.base,
            umbrellaStatus: TaskStatus.RunningUmbrella,
            statusCounts: {
              [TaskStatus.Dispatched]: 4,
              [TaskStatus.Started]: 5,
            },
          },
        ],
        max: 9,
        total: 17,
      },
      "14": {
        stats: [
          {
            count: 4,
            statuses: [taskStatusToCopy[TaskStatus.Succeeded]],
            color: green.base,
            umbrellaStatus: TaskStatus.Succeeded,
            statusCounts: { [TaskStatus.Succeeded]: 4 },
          },
          {
            count: 6,
            statuses: [taskStatusToCopy[TaskStatus.TaskTimedOut]],
            color: red.base,
            umbrellaStatus: TaskStatus.FailedUmbrella,
            statusCounts: { [TaskStatus.TaskTimedOut]: 6 },
          },
          {
            count: 7,
            statuses: [
              taskStatusToCopy[TaskStatus.SystemFailed],
              taskStatusToCopy[TaskStatus.SystemUnresponsive],
            ],
            color: purple.base,
            umbrellaStatus: TaskStatus.SystemFailureUmbrella,
            statusCounts: {
              [TaskStatus.SystemFailed]: 5,
              [TaskStatus.SystemUnresponsive]: 2,
            },
          },
          {
            count: 3,
            statuses: [taskStatusToCopy[TaskStatus.SetupFailed]],
            color: purple.light1,
            umbrellaStatus: TaskStatus.SetupFailed,
            statusCounts: { [TaskStatus.SetupFailed]: 3 },
          },
          {
            count: 3,
            statuses: [taskStatusToCopy[TaskStatus.Started]],
            color: yellow.base,
            umbrellaStatus: TaskStatus.RunningUmbrella,
            statusCounts: { started: 3 },
          },
          {
            count: 2,
            statuses: [taskStatusToCopy[TaskStatus.Unscheduled]],
            color: gray.dark1,
            umbrellaStatus: TaskStatus.UndispatchedUmbrella,
            statusCounts: { [TaskStatus.Unscheduled]: 2 },
          },
        ],
        max: 7,
        total: 25,
      },
      "123": {
        stats: [
          {
            count: 4,
            statuses: [taskStatusToCopy[TaskStatus.Succeeded]],
            color: green.base,
            umbrellaStatus: TaskStatus.Succeeded,
            statusCounts: { [TaskStatus.Succeeded]: 4 },
          },
          {
            count: 6,
            statuses: [taskStatusToCopy[TaskStatus.TaskTimedOut]],
            color: red.base,
            umbrellaStatus: TaskStatus.FailedUmbrella,
            statusCounts: { [TaskStatus.TaskTimedOut]: 6 },
          },
          {
            count: 7,
            statuses: [
              taskStatusToCopy[TaskStatus.SystemFailed],
              taskStatusToCopy[TaskStatus.SystemUnresponsive],
            ],
            color: purple.base,
            umbrellaStatus: TaskStatus.SystemFailureUmbrella,
            statusCounts: {
              [TaskStatus.SystemFailed]: 5,
              [TaskStatus.SystemUnresponsive]: 2,
            },
          },
          {
            count: 3,
            statuses: [taskStatusToCopy[TaskStatus.SetupFailed]],
            color: purple.light1,
            umbrellaStatus: TaskStatus.SetupFailed,
            statusCounts: { [TaskStatus.SetupFailed]: 3 },
          },
          {
            count: 3,
            statuses: [taskStatusToCopy[TaskStatus.Started]],
            color: yellow.base,
            umbrellaStatus: TaskStatus.RunningUmbrella,
            statusCounts: { started: 3 },
          },
          {
            count: 2,
            statuses: [taskStatusToCopy[TaskStatus.Unscheduled]],
            color: gray.dark1,
            umbrellaStatus: TaskStatus.UndispatchedUmbrella,
            statusCounts: { [TaskStatus.Unscheduled]: 2 },
          },
        ],
        max: 7,
        total: 25,
      },
    });
  });
});

describe("getStatusesWithZeroCount", () => {
  it("return an array of umbrella statuses that have 0 count", () => {
    expect(getStatusesWithZeroCount(groupedTaskStats)).toStrictEqual([
      TaskStatus.FailedUmbrella,
      TaskStatus.RunningUmbrella,
      TaskStatus.ScheduledUmbrella,
      TaskStatus.SystemFailureUmbrella,
      TaskStatus.UndispatchedUmbrella,
    ]);
  });
  it("should return an empty array when all umbrella statuses are present", () => {
    expect(getStatusesWithZeroCount(groupedTaskStatsAll)).toStrictEqual([]);
  });
  it("return an array of all umbrella statuses when no umbrella status exists", () => {
    expect(getStatusesWithZeroCount([])).toStrictEqual([
      TaskStatus.FailedUmbrella,
      TaskStatus.Succeeded,
      TaskStatus.RunningUmbrella,
      TaskStatus.ScheduledUmbrella,
      TaskStatus.SystemFailureUmbrella,
      TaskStatus.UndispatchedUmbrella,
      TaskStatus.SetupFailed,
    ]);
  });
});

describe("constructBuildVariantDict", () => {
  it("correctly determines priority, iconHeight, and cardHeight", () => {
    expect(constructBuildVariantDict(versions)).toStrictEqual({
      code_health: {
        iconHeight: TASK_ICON_HEIGHT + TASK_ICON_PADDING,
        cardHeight: GROUPED_BADGE_HEIGHT * 2 + GROUPED_BADGE_PADDING,
        priority: 4,
      },
      package_rpm: {
        iconHeight: TASK_ICON_HEIGHT + TASK_ICON_PADDING,
        cardHeight: 0,
        priority: 2,
      },
      unit_java: {
        iconHeight: TASK_ICON_HEIGHT + TASK_ICON_PADDING,
        cardHeight: 0,
        priority: 1,
      },
    });
  });
});

const buildVariant1 = {
  displayName: "01. Code Health [code_health]",
  variant: "code_health",
  tasks: [
    {
      status: TaskStatus.WillRun,
      id: "code_health",
      execution: 0,
      displayName: "Code Health",
    },
  ],
};

const buildVariant2 = {
  displayName: "02. Packaging (RPM - RHEL7) [package_rpm]",
  variant: "package_rpm",
  tasks: [
    {
      status: TaskStatus.Pending,
      id: "code_health",
      execution: 0,
      displayName: "Code Health",
    },
  ],
};

const buildVariant3 = {
  displayName: "03a. Unit Tests Java [unit_java]",
  variant: "unit_java",
  tasks: [
    {
      status: TaskStatus.Failed,
      id: "unit_java",
      execution: 0,
      displayName: "Unit Tests",
    },
  ],
};

const buildVariantStat1 = {
  displayName: "01. Code Health [code_health]",
  variant: "code_health",
  statusCounts: [
    {
      count: 4,
      status: TaskStatus.Blocked,
    },
    {
      count: 1,
      status: TaskStatus.Succeeded,
    },
    {
      count: 1,
      status: TaskStatus.Failed,
    },
  ],
};

const versions = [
  {
    version: {
      id: "123",
      projectIdentifier: "mms",
      createTime: new Date("2021-06-16T23:38:13Z"),
      message: "SERVER-57332 Create skeleton InternalDocumentSourceDensify",
      order: 39369,
      author: "Mohamed Khelif",
      revision: "4337c33fa4a0d5c747a1115f0853b5f70e46f112",
      taskStatusCounts: [
        { status: TaskStatus.TaskTimedOut, count: 6 },
        { status: TaskStatus.Succeeded, count: 4 },
        { status: TaskStatus.Started, count: 3 },
        { status: TaskStatus.SystemFailed, count: 5 },
        { status: TaskStatus.Unscheduled, count: 2 },
        { status: TaskStatus.SetupFailed, count: 3 },
        { status: TaskStatus.SystemUnresponsive, count: 2 },
      ],
      buildVariants: [buildVariant1],
      buildVariantStats: [buildVariantStat1],
    },
    rolledUpVersions: null,
  },
  {
    version: {
      id: "12",
      projectIdentifier: "mms",
      createTime: new Date("2021-06-16T23:38:13Z"),
      message: "SERVER-57333 Some complicated server commit",
      order: 39368,
      author: "Arjun Patel",
      revision: "4337c33fa4a0d5c747a1115f0853b5f70e46f112",
      taskStatusCounts: [
        { status: TaskStatus.TestTimedOut, count: 6 },
        { status: TaskStatus.Failed, count: 2 },
        { status: TaskStatus.Dispatched, count: 4 },
        { status: TaskStatus.WillRun, count: 2 },
        { status: TaskStatus.SystemTimedOut, count: 5 },
        { status: TaskStatus.SystemUnresponsive, count: 2 },
      ],
      buildVariants: [buildVariant1, buildVariant2],
      buildVariantStats: [],
    },
    rolledUpVersions: null,
  },
  {
    version: {
      id: "13",
      projectIdentifier: "mms",
      createTime: new Date("2021-06-16T23:38:13Z"),
      message: "SERVER-57332 Create skeleton InternalDocumentSourceDensify",
      order: 39367,
      author: "Mohamed Khelif",
      revision: "4337c33fa4a0d5c747a1115f0853b5f70e46f112",
      taskStatusCounts: [
        { status: TaskStatus.Succeeded, count: 6 },
        { status: TaskStatus.Failed, count: 2 },
        { status: TaskStatus.Dispatched, count: 4 },
        { status: TaskStatus.Started, count: 5 },
      ],
      buildVariants: [buildVariant1, buildVariant2, buildVariant3],
      buildVariantStats: [],
    },
    rolledUpVersions: null,
  },
  {
    version: {
      id: "14",
      projectIdentifier: "mms",
      createTime: new Date("2021-06-16T23:38:13Z"),
      message: "SERVER-57333 Some complicated server commit",
      order: 39366,
      author: "Arjun Patel",
      revision: "4337c33fa4a0d5c747a1115f0853b5f70e46f112",
      taskStatusCounts: [
        { status: TaskStatus.TaskTimedOut, count: 6 },
        { status: TaskStatus.Succeeded, count: 4 },
        { status: TaskStatus.Started, count: 3 },
        { status: TaskStatus.SystemFailed, count: 5 },
        { status: TaskStatus.Unscheduled, count: 2 },
        { status: TaskStatus.SetupFailed, count: 3 },
        { status: TaskStatus.SystemUnresponsive, count: 2 },
      ],
      buildVariants: [buildVariant1],
      buildVariantStats: [],
    },
    rolledUpVersions: null,
  },
];

const groupedTaskStatsAll = [
  {
    umbrellaStatus: TaskStatus.Succeeded,
    count: 2,
    statuses: [TaskStatus.Succeeded],
    color: green.base,
  },
  {
    umbrellaStatus: TaskStatus.FailedUmbrella,
    count: 1,
    statuses: [TaskStatus.Failed],
    color: red.base,
  },
  {
    umbrellaStatus: TaskStatus.SystemFailureUmbrella,
    count: 3,
    statuses: [TaskStatus.SystemFailed],
    color: purple.base,
  },
  {
    umbrellaStatus: TaskStatus.SetupFailed,
    count: 5,
    statuses: [TaskStatus.SetupFailed],
    color: purple.base,
  },
  {
    umbrellaStatus: TaskStatus.Undispatched,
    count: 1,
    statuses: [TaskStatus.Unscheduled],
    color: gray.dark1,
  },
  {
    umbrellaStatus: TaskStatus.RunningUmbrella,
    count: 6,
    statuses: [TaskStatus.Started],
    color: yellow.base,
  },
  {
    umbrellaStatus: TaskStatus.Dispatched,
    count: 7,
    statuses: [TaskStatus.Dispatched],
    color: gray.dark1,
  },
  {
    umbrellaStatus: TaskStatus.Inactive,
    count: 7,
    statuses: [TaskStatus.Inactive],
    color: gray.dark1,
  },
  {
    umbrellaStatus: TaskStatus.ScheduledUmbrella,
    count: 7,
    statuses: [TaskStatus.WillRun],
    color: gray.dark1,
  },
  {
    umbrellaStatus: TaskStatus.UndispatchedUmbrella,
    count: 7,
    statuses: [TaskStatus.Unscheduled],
    color: gray.dark1,
  },
];

const groupedTaskStats = [
  {
    umbrellaStatus: TaskStatus.Succeeded,
    count: 2,
    statuses: [TaskStatus.Succeeded],
    color: green.base,
  },
  {
    umbrellaStatus: TaskStatus.Failed,
    count: 1,
    statuses: [TaskStatus.Failed],
    color: red.base,
  },
  {
    umbrellaStatus: TaskStatus.Unscheduled,
    count: 1,
    statuses: [TaskStatus.Unscheduled],
    color: gray.dark1,
  },
  {
    umbrellaStatus: TaskStatus.SetupFailed,
    count: 5,
    statuses: [TaskStatus.SetupFailed],
    color: purple.light1,
  },
];

describe("roundMax", () => {
  it("properly rounds numbers", () => {
    expect(roundMax(8)).toBe(10); // 0 <= x < 100
    expect(roundMax(147)).toBe(150); // 100 <= x < 500
    expect(roundMax(712)).toBe(800); // 500 <= x < 1000
    expect(roundMax(1320)).toBe(1500); // 1000 <= x < 5000
    expect(roundMax(6430)).toBe(7000); // 5000 <= x
  });
});

describe("hoverTaskIcons", () => {
  const constructTaskIcon = (dataTaskIconName: string) => {
    const element = document.createElement("div");
    element.setAttribute("data-task-icon", dataTaskIconName);
    element.setAttribute("style", "opacity: 1;");
    document.body.appendChild(element);
    return element;
  };

  it("should deemphasize task icons that don't match with current hovered icon", () => {
    const testUtilIcon1 = constructTaskIcon("ubuntu1604-test_util");
    const testUtilIcon2 = constructTaskIcon("ubuntu1604-test_util");
    const testCodegenIcon = constructTaskIcon("ubuntu1604-test_codegen");

    // Call function to set the mouseover behavior
    hoverTaskIcons();

    // Check default opacity
    expect(testUtilIcon1.style.opacity).toBe("1");
    expect(testUtilIcon2.style.opacity).toBe("1");
    expect(testCodegenIcon.style.opacity).toBe("1");

    // Styles should change on hover
    fireEvent.mouseOver(testUtilIcon1);
    expect(testUtilIcon1.style.opacity).toBe("1");
    expect(testUtilIcon2.style.opacity).toBe("1");
    expect(testCodegenIcon.style.opacity).toBe("0.25");
    fireEvent.mouseOut(testUtilIcon1);

    // Styles should change on hover
    fireEvent.mouseOver(testCodegenIcon);
    expect(testUtilIcon1.style.opacity).toBe("0.25");
    expect(testUtilIcon2.style.opacity).toBe("0.25");
    expect(testCodegenIcon.style.opacity).toBe("1");
  });
});
