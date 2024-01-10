import { palette } from "@leafygreen-ui/palette";
import { taskStatusToCopy } from "constants/task";
import { ProjectHealthView } from "gql/generated/types";
import { TaskStatus } from "types/task";
import {
  ALL_NON_FAILING_STATUSES,
  FAILED_STATUSES,
  GROUPED_BADGE_HEIGHT,
  GROUPED_BADGE_PADDING,
  TASK_ICON_HEIGHT,
  TASK_ICON_PADDING,
  impossibleMatch,
} from "./constants";
import { versions } from "./testData";
import {
  getMainlineCommitsQueryVariables,
  getFilterStatus,
  getAllTaskStatsGroupedByColor,
  constructBuildVariantDict,
} from "./utils";

const { gray, green, purple, red, yellow } = palette;

describe("getFilterStatus", () => {
  it("should return an object containing booleans that describe what filters have been applied", () => {
    expect(
      getFilterStatus({
        statuses: ["failed"],
        tasks: ["task1"],
        variants: ["variant1"],
        requesters: ["requester1"],
        view: ProjectHealthView.Failed,
      }),
    ).toStrictEqual({
      hasFilters: true,
      hasRequesterFilter: true,
      hasStatuses: true,
      hasTasks: true,
      hasVariants: true,
    });
    expect(
      getFilterStatus({
        statuses: [],
        tasks: [],
        variants: [],
        requesters: [],
        view: ProjectHealthView.Failed,
      }),
    ).toStrictEqual({
      hasFilters: false,
      hasRequesterFilter: false,
      hasStatuses: false,
      hasTasks: false,
      hasVariants: false,
    });
    expect(
      getFilterStatus({
        statuses: [],
        tasks: ["task1"],
        variants: [],
        requesters: [],
        view: ProjectHealthView.Failed,
      }),
    ).toStrictEqual({
      hasFilters: true,
      hasRequesterFilter: false,
      hasStatuses: false,
      hasTasks: true,
      hasVariants: false,
    });
  });
});

describe("getMainlineCommitsQueryVariables", () => {
  describe("mainlineCommitsOptions", () => {
    it("default with no filters", () => {
      expect(
        getMainlineCommitsQueryVariables({
          mainlineCommitOptions: {
            projectIdentifier: "projectIdentifier",
            limit: 5,
            skipOrderNumber: 0,
            revision: "revision",
          },
          filterState: {
            statuses: [],
            tasks: [],
            variants: [],
            requesters: [],
            view: ProjectHealthView.Failed,
          },
        }).mainlineCommitsOptions,
      ).toStrictEqual({
        limit: 5,
        projectIdentifier: "projectIdentifier",
        skipOrderNumber: 0,
        revision: "revision",
        shouldCollapse: false,
        requesters: [],
      });
    });
    it("filters should collapse commits", () => {
      expect(
        getMainlineCommitsQueryVariables({
          mainlineCommitOptions: {
            projectIdentifier: "projectIdentifier",
            limit: 5,
            skipOrderNumber: 0,
            revision: "revision",
          },
          filterState: {
            statuses: [],
            tasks: ["test1"],
            variants: [],
            requesters: [],
            view: ProjectHealthView.Failed,
          },
        }).mainlineCommitsOptions,
      ).toStrictEqual({
        limit: 5,
        projectIdentifier: "projectIdentifier",
        skipOrderNumber: 0,
        revision: "revision",
        shouldCollapse: true,
        requesters: [],
      });
      expect(
        getMainlineCommitsQueryVariables({
          mainlineCommitOptions: {
            projectIdentifier: "projectIdentifier",
            limit: 5,
            skipOrderNumber: 0,
            revision: "revision",
          },
          filterState: {
            statuses: [TaskStatus.Succeeded],
            tasks: [],
            variants: [],
            requesters: [],
            view: ProjectHealthView.Failed,
          },
        }).mainlineCommitsOptions,
      ).toStrictEqual({
        limit: 5,
        projectIdentifier: "projectIdentifier",
        skipOrderNumber: 0,
        revision: "revision",
        shouldCollapse: true,
        requesters: [],
      });
      expect(
        getMainlineCommitsQueryVariables({
          mainlineCommitOptions: {
            projectIdentifier: "projectIdentifier",
            limit: 5,
            skipOrderNumber: 0,
            revision: "revision",
          },
          filterState: {
            statuses: [],
            tasks: ["test1"],
            variants: [],
            requesters: [],
            view: ProjectHealthView.Failed,
          },
        }).mainlineCommitsOptions,
      ).toStrictEqual({
        limit: 5,
        projectIdentifier: "projectIdentifier",
        skipOrderNumber: 0,
        revision: "revision",
        shouldCollapse: true,
        requesters: [],
      });
      expect(
        getMainlineCommitsQueryVariables({
          mainlineCommitOptions: {
            projectIdentifier: "projectIdentifier",
            limit: 5,
            skipOrderNumber: 0,
            revision: "revision",
          },
          filterState: {
            statuses: [],
            tasks: [],
            variants: ["test1"],
            requesters: [],
            view: ProjectHealthView.Failed,
          },
        }).mainlineCommitsOptions,
      ).toStrictEqual({
        limit: 5,
        projectIdentifier: "projectIdentifier",
        skipOrderNumber: 0,
        revision: "revision",
        shouldCollapse: true,
        requesters: [],
      });
    });
  });
  describe("buildVariantOptions", () => {
    it("should always match applied filters", () => {
      expect(
        getMainlineCommitsQueryVariables({
          mainlineCommitOptions: {
            projectIdentifier: "projectIdentifier",
            limit: 5,
            skipOrderNumber: 0,
            revision: "",
          },
          filterState: {
            statuses: [],
            tasks: [],
            variants: [],
            requesters: [],
            view: ProjectHealthView.Failed,
          },
        }).buildVariantOptions,
      ).toStrictEqual({
        tasks: [],
        variants: [],
        statuses: [],
        includeBaseTasks: false,
      });
      expect(
        getMainlineCommitsQueryVariables({
          mainlineCommitOptions: {
            projectIdentifier: "projectIdentifier",
            limit: 5,
            skipOrderNumber: 0,
            revision: "",
          },
          filterState: {
            statuses: [TaskStatus.Failed],
            tasks: [],
            variants: [],
            requesters: [],
            view: ProjectHealthView.Failed,
          },
        }).buildVariantOptions,
      ).toStrictEqual({
        tasks: [],
        variants: [],
        statuses: [TaskStatus.Failed],
        includeBaseTasks: false,
      });
      expect(
        getMainlineCommitsQueryVariables({
          mainlineCommitOptions: {
            projectIdentifier: "projectIdentifier",
            limit: 5,
            skipOrderNumber: 0,
            revision: "",
          },
          filterState: {
            statuses: [],
            tasks: ["task1"],
            variants: [],
            requesters: [],
            view: ProjectHealthView.Failed,
          },
        }).buildVariantOptions,
      ).toStrictEqual({
        tasks: ["task1"],
        variants: [],
        statuses: [],
        includeBaseTasks: false,
      });
    });
  });
  describe("buildVariantOptionsForGraph", () => {
    it("should return no task filters by default", () => {
      expect(
        getMainlineCommitsQueryVariables({
          mainlineCommitOptions: {
            projectIdentifier: "projectIdentifier",
            limit: 5,
            skipOrderNumber: 0,
            revision: "",
          },
          filterState: {
            statuses: [],
            tasks: [],
            variants: [],
            requesters: [],
            view: ProjectHealthView.Failed,
          },
        }).buildVariantOptionsForGraph,
      ).toStrictEqual({
        tasks: [],
        variants: [],
        statuses: [],
      });
    });
    it("should apply all filters when they are provided", () => {
      expect(
        getMainlineCommitsQueryVariables({
          mainlineCommitOptions: {
            projectIdentifier: "projectIdentifier",
            limit: 5,
            skipOrderNumber: 0,
            revision: "",
          },
          filterState: {
            statuses: [TaskStatus.Failed],
            tasks: [],
            variants: [],
            requesters: [],
            view: ProjectHealthView.Failed,
          },
        }).buildVariantOptionsForGraph,
      ).toStrictEqual({
        tasks: [],
        variants: [],
        statuses: [TaskStatus.Failed],
      });
      expect(
        getMainlineCommitsQueryVariables({
          mainlineCommitOptions: {
            projectIdentifier: "projectIdentifier",
            limit: 5,
            skipOrderNumber: 0,
            revision: "",
          },
          filterState: {
            statuses: [],
            tasks: ["task1"],
            variants: [],
            requesters: [],
            view: ProjectHealthView.Failed,
          },
        }).buildVariantOptionsForGraph,
      ).toStrictEqual({
        tasks: ["task1"],
        variants: [],
        statuses: [],
      });
      expect(
        getMainlineCommitsQueryVariables({
          mainlineCommitOptions: {
            projectIdentifier: "projectIdentifier",
            limit: 5,
            skipOrderNumber: 0,
            revision: "",
          },
          filterState: {
            statuses: [],
            tasks: [],
            variants: ["variant1"],
            requesters: [],
            view: ProjectHealthView.Failed,
          },
        }).buildVariantOptionsForGraph,
      ).toStrictEqual({
        tasks: [],
        variants: ["variant1"],
        statuses: [],
      });
    });
  });
  describe("buildVariantOptionsForTaskIcons", () => {
    it("should only return failing task icons when there are no filters applied", () => {
      expect(
        getMainlineCommitsQueryVariables({
          mainlineCommitOptions: {
            projectIdentifier: "projectIdentifier",
            limit: 5,
            skipOrderNumber: 0,
            revision: "",
          },
          filterState: {
            statuses: [],
            tasks: [],
            variants: [],
            requesters: [],
            view: ProjectHealthView.Failed,
          },
        }).buildVariantOptionsForTaskIcons,
      ).toStrictEqual({
        tasks: [],
        variants: [],
        statuses: FAILED_STATUSES,
        includeBaseTasks: false,
      });
    });

    it("should return all task icons when there are no filters applied using the 'All' view", () => {
      expect(
        getMainlineCommitsQueryVariables({
          mainlineCommitOptions: {
            projectIdentifier: "projectIdentifier",
            limit: 5,
            skipOrderNumber: 0,
            revision: "",
          },
          filterState: {
            statuses: [],
            tasks: [],
            variants: [],
            requesters: [],
            view: ProjectHealthView.All,
          },
        }).buildVariantOptionsForTaskIcons,
      ).toStrictEqual({
        tasks: [],
        variants: [],
        statuses: [],
        includeBaseTasks: false,
      });
    });

    it("should not return any task icons when a non failing status filter is applied", () => {
      expect(
        getMainlineCommitsQueryVariables({
          mainlineCommitOptions: {
            projectIdentifier: "projectIdentifier",
            limit: 5,
            skipOrderNumber: 0,
            revision: "",
          },
          filterState: {
            statuses: [TaskStatus.Succeeded],
            tasks: [],
            variants: [],
            requesters: [],
            view: ProjectHealthView.Failed,
          },
        }).buildVariantOptionsForTaskIcons,
      ).toStrictEqual({
        tasks: [impossibleMatch],
        variants: [],
        statuses: [],
        includeBaseTasks: false,
      });
    });

    it("should return any task icons when a non failing status filter is applied using the 'All' view", () => {
      expect(
        getMainlineCommitsQueryVariables({
          mainlineCommitOptions: {
            projectIdentifier: "projectIdentifier",
            limit: 5,
            skipOrderNumber: 0,
            revision: "",
          },
          filterState: {
            statuses: [TaskStatus.Succeeded],
            tasks: [],
            variants: [],
            requesters: [],
            view: ProjectHealthView.All,
          },
        }).buildVariantOptionsForTaskIcons,
      ).toStrictEqual({
        tasks: [],
        variants: [],
        statuses: [TaskStatus.Succeeded],
        includeBaseTasks: false,
      });
    });

    it("should only show failing task icons when there are multiple statuses with mixed failing and non failing statuses", () => {
      expect(
        getMainlineCommitsQueryVariables({
          mainlineCommitOptions: {
            projectIdentifier: "projectIdentifier",
            limit: 5,
            skipOrderNumber: 0,
            revision: "",
          },
          filterState: {
            statuses: [TaskStatus.Failed, TaskStatus.Succeeded],
            tasks: [],
            variants: [],
            requesters: [],
            view: ProjectHealthView.Failed,
          },
        }).buildVariantOptionsForTaskIcons,
      ).toStrictEqual({
        tasks: [],
        variants: [],
        statuses: [TaskStatus.Failed],
        includeBaseTasks: false,
      });
    });
    it("should return all matching tasks when a task filter is applied regardless of status", () => {
      expect(
        getMainlineCommitsQueryVariables({
          mainlineCommitOptions: {
            projectIdentifier: "projectIdentifier",
            limit: 5,
            skipOrderNumber: 0,
            revision: "",
          },
          filterState: {
            statuses: [],
            tasks: ["task1"],
            variants: [],
            requesters: [],
            view: ProjectHealthView.Failed,
          },
        }).buildVariantOptionsForTaskIcons,
      ).toStrictEqual({
        tasks: ["task1"],
        variants: [],
        statuses: [],
        includeBaseTasks: false,
      });
      expect(
        getMainlineCommitsQueryVariables({
          mainlineCommitOptions: {
            projectIdentifier: "projectIdentifier",
            limit: 5,
            skipOrderNumber: 0,
            revision: "",
          },
          filterState: {
            statuses: [TaskStatus.Succeeded],
            tasks: ["task1"],
            variants: [],
            requesters: [],
            view: ProjectHealthView.Failed,
          },
        }).buildVariantOptionsForTaskIcons,
      ).toStrictEqual({
        tasks: ["task1"],
        variants: [],
        statuses: [TaskStatus.Succeeded],
        includeBaseTasks: false,
      });
    });
    it("should only return failing tasks when a variant filter is applied with no other filters", () => {
      expect(
        getMainlineCommitsQueryVariables({
          mainlineCommitOptions: {
            projectIdentifier: "projectIdentifier",
            limit: 5,
            skipOrderNumber: 0,
            revision: "",
          },
          filterState: {
            statuses: [],
            tasks: [],
            variants: ["variant1"],
            requesters: [],
            view: ProjectHealthView.Failed,
          },
        }).buildVariantOptionsForTaskIcons,
      ).toStrictEqual({
        tasks: [],
        variants: ["variant1"],
        statuses: FAILED_STATUSES,
        includeBaseTasks: false,
      });
    });
  });

  describe("buildVariantOptionsForGroupedTasks", () => {
    it("should not return any grouped tasks when there are no filters applied", () => {
      expect(
        getMainlineCommitsQueryVariables({
          mainlineCommitOptions: {
            projectIdentifier: "projectIdentifier",
            limit: 5,
            skipOrderNumber: 0,
            revision: "",
          },
          filterState: {
            statuses: [],
            tasks: [],
            variants: [],
            requesters: [],
            view: ProjectHealthView.Failed,
          },
        }).buildVariantOptionsForGroupedTasks,
      ).toStrictEqual({
        tasks: [impossibleMatch],
        statuses: [],
        variants: [],
      });
    });

    it("should not return any grouped tasks when there are no filters applied using the 'All' view", () => {
      expect(
        getMainlineCommitsQueryVariables({
          mainlineCommitOptions: {
            projectIdentifier: "projectIdentifier",
            limit: 5,
            skipOrderNumber: 0,
            revision: "",
          },
          filterState: {
            statuses: [],
            tasks: [],
            variants: [],
            requesters: [],
            view: ProjectHealthView.All,
          },
        }).buildVariantOptionsForGroupedTasks,
      ).toStrictEqual({
        tasks: [impossibleMatch],
        statuses: [],
        variants: [],
      });
    });

    it("should group statuses when a non failing status filter is applied", () => {
      expect(
        getMainlineCommitsQueryVariables({
          mainlineCommitOptions: {
            projectIdentifier: "projectIdentifier",
            limit: 5,
            skipOrderNumber: 0,
            revision: "",
          },
          filterState: {
            statuses: [TaskStatus.Succeeded],
            tasks: [],
            variants: [],
            requesters: [],
            view: ProjectHealthView.Failed,
          },
        }).buildVariantOptionsForGroupedTasks,
      ).toStrictEqual({
        tasks: [],
        variants: [],
        statuses: [TaskStatus.Succeeded],
      });
    });

    it("should not group statuses when a non failing status filter is applied using the 'All' view", () => {
      expect(
        getMainlineCommitsQueryVariables({
          mainlineCommitOptions: {
            projectIdentifier: "projectIdentifier",
            limit: 5,
            skipOrderNumber: 0,
            revision: "",
          },
          filterState: {
            statuses: [TaskStatus.Succeeded],
            tasks: [],
            variants: [],
            requesters: [],
            view: ProjectHealthView.All,
          },
        }).buildVariantOptionsForGroupedTasks,
      ).toStrictEqual({
        tasks: [impossibleMatch],
        variants: [],
        statuses: [],
      });
    });

    it("should not return groupings for failing statuses if there are multiple statuses", () => {
      expect(
        getMainlineCommitsQueryVariables({
          mainlineCommitOptions: {
            projectIdentifier: "projectIdentifier",
            limit: 5,
            skipOrderNumber: 0,
            revision: "",
          },
          filterState: {
            statuses: [TaskStatus.Succeeded, TaskStatus.Failed],
            tasks: [],
            variants: [],
            requesters: [],
            view: ProjectHealthView.Failed,
          },
        }).buildVariantOptionsForGroupedTasks,
      ).toStrictEqual({
        tasks: [],
        variants: [],
        statuses: [TaskStatus.Succeeded],
      });
    });
    it("should not return groupings for failing statuses if there are only failing statuses", () => {
      expect(
        getMainlineCommitsQueryVariables({
          mainlineCommitOptions: {
            projectIdentifier: "projectIdentifier",
            limit: 5,
            skipOrderNumber: 0,
            revision: "",
          },
          filterState: {
            statuses: [TaskStatus.Failed],
            tasks: [],
            variants: [],
            requesters: [],
            view: ProjectHealthView.Failed,
          },
        }).buildVariantOptionsForGroupedTasks,
      ).toStrictEqual({
        tasks: [impossibleMatch],
        variants: [],
        statuses: [],
      });
    });
    it("should not group failing statuses when there are other filters applied", () => {
      expect(
        getMainlineCommitsQueryVariables({
          mainlineCommitOptions: {
            projectIdentifier: "projectIdentifier",
            limit: 5,
            skipOrderNumber: 0,
            revision: "",
          },
          filterState: {
            statuses: [],
            tasks: [],
            variants: ["variant1"],
            requesters: [],
            view: ProjectHealthView.Failed,
          },
        }).buildVariantOptionsForGroupedTasks,
      ).toStrictEqual({
        tasks: [],
        variants: ["variant1"],
        statuses: ALL_NON_FAILING_STATUSES,
      });
    });
    it("should not return any task groupings if there are task filters applied", () => {
      expect(
        getMainlineCommitsQueryVariables({
          mainlineCommitOptions: {
            projectIdentifier: "projectIdentifier",
            limit: 5,
            skipOrderNumber: 0,
            revision: "",
          },
          filterState: {
            statuses: [],
            tasks: ["task1"],
            variants: [],
            requesters: [],
            view: ProjectHealthView.Failed,
          },
        }).buildVariantOptionsForGroupedTasks,
      ).toStrictEqual({
        tasks: [impossibleMatch],
        variants: [],
        statuses: [],
      });
      expect(
        getMainlineCommitsQueryVariables({
          mainlineCommitOptions: {
            projectIdentifier: "projectIdentifier",
            limit: 5,
            skipOrderNumber: 0,
            revision: "",
          },
          filterState: {
            statuses: [TaskStatus.Failed],
            tasks: ["task1"],
            variants: [],
            requesters: [],
            view: ProjectHealthView.Failed,
          },
        }).buildVariantOptionsForGroupedTasks,
      ).toStrictEqual({
        tasks: [impossibleMatch],
        variants: [],
        statuses: [],
      });
    });
  });
});

describe("getAllTaskStatsGroupedByColor", () => {
  it("grab the taskStatusStats.statusCounts field from all versions, returns mapping between version id to its {grouped task stats, max, total}", () => {
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
            color: purple.dark2,
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
            color: green.dark1,
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
            color: green.dark1,
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
            color: purple.dark2,
            umbrellaStatus: TaskStatus.SystemFailureUmbrella,
            statusCounts: {
              [TaskStatus.SystemFailed]: 5,
              [TaskStatus.SystemUnresponsive]: 2,
            },
          },
          {
            count: 3,
            statuses: [taskStatusToCopy[TaskStatus.SetupFailed]],
            color: purple.light2,
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
            color: green.dark1,
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
            color: purple.dark2,
            umbrellaStatus: TaskStatus.SystemFailureUmbrella,
            statusCounts: {
              [TaskStatus.SystemFailed]: 5,
              [TaskStatus.SystemUnresponsive]: 2,
            },
          },
          {
            count: 3,
            statuses: [taskStatusToCopy[TaskStatus.SetupFailed]],
            color: purple.light2,
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

describe("constructBuildVariantDict", () => {
  it("correctly determines priority, iconHeight, and badgeHeight", () => {
    expect(constructBuildVariantDict(versions)).toStrictEqual({
      "enterprise-macos-cxx20": {
        iconHeight: TASK_ICON_HEIGHT + TASK_ICON_PADDING * 2,
        badgeHeight: GROUPED_BADGE_HEIGHT * 2 + GROUPED_BADGE_PADDING * 2,
        priority: 4,
      },
      "enterprise-windows-benchmarks": {
        iconHeight: TASK_ICON_HEIGHT + TASK_ICON_PADDING * 2,
        badgeHeight: 0,
        priority: 2,
      },
      "enterprise-rhel-80-64-bit-inmem": {
        iconHeight: TASK_ICON_HEIGHT + TASK_ICON_PADDING * 2,
        badgeHeight: 0,
        priority: 1,
      },
    });
  });
});
