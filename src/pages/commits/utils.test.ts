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
        requesters: ["requester1"],
        statuses: ["failed"],
        tasks: ["task1"],
        variants: ["variant1"],
        view: ProjectHealthView.Failed,
      })
    ).toStrictEqual({
      hasFilters: true,
      hasRequesterFilter: true,
      hasStatuses: true,
      hasTasks: true,
      hasVariants: true,
    });
    expect(
      getFilterStatus({
        requesters: [],
        statuses: [],
        tasks: [],
        variants: [],
        view: ProjectHealthView.Failed,
      })
    ).toStrictEqual({
      hasFilters: false,
      hasRequesterFilter: false,
      hasStatuses: false,
      hasTasks: false,
      hasVariants: false,
    });
    expect(
      getFilterStatus({
        requesters: [],
        statuses: [],
        tasks: ["task1"],
        variants: [],
        view: ProjectHealthView.Failed,
      })
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
          filterState: {
            requesters: [],
            statuses: [],
            tasks: [],
            variants: [],
            view: ProjectHealthView.Failed,
          },
          mainlineCommitOptions: {
            limit: 5,
            projectIdentifier: "projectIdentifier",
            skipOrderNumber: 0,
          },
        }).mainlineCommitsOptions
      ).toStrictEqual({
        limit: 5,
        projectIdentifier: "projectIdentifier",
        requesters: [],
        shouldCollapse: false,
        skipOrderNumber: 0,
      });
    });
    it("filters should collapse commits", () => {
      expect(
        getMainlineCommitsQueryVariables({
          filterState: {
            requesters: [],
            statuses: [],
            tasks: ["test1"],
            variants: [],
            view: ProjectHealthView.Failed,
          },
          mainlineCommitOptions: {
            limit: 5,
            projectIdentifier: "projectIdentifier",
            skipOrderNumber: 0,
          },
        }).mainlineCommitsOptions
      ).toStrictEqual({
        limit: 5,
        projectIdentifier: "projectIdentifier",
        requesters: [],
        shouldCollapse: true,
        skipOrderNumber: 0,
      });
      expect(
        getMainlineCommitsQueryVariables({
          filterState: {
            requesters: [],
            statuses: [TaskStatus.Succeeded],
            tasks: [],
            variants: [],
            view: ProjectHealthView.Failed,
          },
          mainlineCommitOptions: {
            limit: 5,
            projectIdentifier: "projectIdentifier",
            skipOrderNumber: 0,
          },
        }).mainlineCommitsOptions
      ).toStrictEqual({
        limit: 5,
        projectIdentifier: "projectIdentifier",
        requesters: [],
        shouldCollapse: true,
        skipOrderNumber: 0,
      });
      expect(
        getMainlineCommitsQueryVariables({
          filterState: {
            requesters: [],
            statuses: [],
            tasks: ["test1"],
            variants: [],
            view: ProjectHealthView.Failed,
          },
          mainlineCommitOptions: {
            limit: 5,
            projectIdentifier: "projectIdentifier",
            skipOrderNumber: 0,
          },
        }).mainlineCommitsOptions
      ).toStrictEqual({
        limit: 5,
        projectIdentifier: "projectIdentifier",
        requesters: [],
        shouldCollapse: true,
        skipOrderNumber: 0,
      });
      expect(
        getMainlineCommitsQueryVariables({
          filterState: {
            requesters: [],
            statuses: [],
            tasks: [],
            variants: ["test1"],
            view: ProjectHealthView.Failed,
          },
          mainlineCommitOptions: {
            limit: 5,
            projectIdentifier: "projectIdentifier",
            skipOrderNumber: 0,
          },
        }).mainlineCommitsOptions
      ).toStrictEqual({
        limit: 5,
        projectIdentifier: "projectIdentifier",
        requesters: [],
        shouldCollapse: true,
        skipOrderNumber: 0,
      });
    });
  });
  describe("buildVariantOptions", () => {
    it("should always match applied filters", () => {
      expect(
        getMainlineCommitsQueryVariables({
          filterState: {
            requesters: [],
            statuses: [],
            tasks: [],
            variants: [],
            view: ProjectHealthView.Failed,
          },
          mainlineCommitOptions: {
            limit: 5,
            projectIdentifier: "projectIdentifier",
            skipOrderNumber: 0,
          },
        }).buildVariantOptions
      ).toStrictEqual({
        includeBaseTasks: false,
        statuses: [],
        tasks: [],
        variants: [],
      });
      expect(
        getMainlineCommitsQueryVariables({
          filterState: {
            requesters: [],
            statuses: [TaskStatus.Failed],
            tasks: [],
            variants: [],
            view: ProjectHealthView.Failed,
          },
          mainlineCommitOptions: {
            limit: 5,
            projectIdentifier: "projectIdentifier",
            skipOrderNumber: 0,
          },
        }).buildVariantOptions
      ).toStrictEqual({
        includeBaseTasks: false,
        statuses: [TaskStatus.Failed],
        tasks: [],
        variants: [],
      });
      expect(
        getMainlineCommitsQueryVariables({
          filterState: {
            requesters: [],
            statuses: [],
            tasks: ["task1"],
            variants: [],
            view: ProjectHealthView.Failed,
          },
          mainlineCommitOptions: {
            limit: 5,
            projectIdentifier: "projectIdentifier",
            skipOrderNumber: 0,
          },
        }).buildVariantOptions
      ).toStrictEqual({
        includeBaseTasks: false,
        statuses: [],
        tasks: ["task1"],
        variants: [],
      });
    });
  });
  describe("buildVariantOptionsForGraph", () => {
    it("should return no task filters by default", () => {
      expect(
        getMainlineCommitsQueryVariables({
          filterState: {
            requesters: [],
            statuses: [],
            tasks: [],
            variants: [],
            view: ProjectHealthView.Failed,
          },
          mainlineCommitOptions: {
            limit: 5,
            projectIdentifier: "projectIdentifier",
            skipOrderNumber: 0,
          },
        }).buildVariantOptionsForGraph
      ).toStrictEqual({
        statuses: [],
        tasks: [],
        variants: [],
      });
    });
    it("should apply all filters when they are provided", () => {
      expect(
        getMainlineCommitsQueryVariables({
          filterState: {
            requesters: [],
            statuses: [TaskStatus.Failed],
            tasks: [],
            variants: [],
            view: ProjectHealthView.Failed,
          },
          mainlineCommitOptions: {
            limit: 5,
            projectIdentifier: "projectIdentifier",
            skipOrderNumber: 0,
          },
        }).buildVariantOptionsForGraph
      ).toStrictEqual({
        statuses: [TaskStatus.Failed],
        tasks: [],
        variants: [],
      });
      expect(
        getMainlineCommitsQueryVariables({
          filterState: {
            requesters: [],
            statuses: [],
            tasks: ["task1"],
            variants: [],
            view: ProjectHealthView.Failed,
          },
          mainlineCommitOptions: {
            limit: 5,
            projectIdentifier: "projectIdentifier",
            skipOrderNumber: 0,
          },
        }).buildVariantOptionsForGraph
      ).toStrictEqual({
        statuses: [],
        tasks: ["task1"],
        variants: [],
      });
      expect(
        getMainlineCommitsQueryVariables({
          filterState: {
            requesters: [],
            statuses: [],
            tasks: [],
            variants: ["variant1"],
            view: ProjectHealthView.Failed,
          },
          mainlineCommitOptions: {
            limit: 5,
            projectIdentifier: "projectIdentifier",
            skipOrderNumber: 0,
          },
        }).buildVariantOptionsForGraph
      ).toStrictEqual({
        statuses: [],
        tasks: [],
        variants: ["variant1"],
      });
    });
  });
  describe("buildVariantOptionsForTaskIcons", () => {
    it("should only return failing task icons when there are no filters applied", () => {
      expect(
        getMainlineCommitsQueryVariables({
          filterState: {
            requesters: [],
            statuses: [],
            tasks: [],
            variants: [],
            view: ProjectHealthView.Failed,
          },
          mainlineCommitOptions: {
            limit: 5,
            projectIdentifier: "projectIdentifier",
            skipOrderNumber: 0,
          },
        }).buildVariantOptionsForTaskIcons
      ).toStrictEqual({
        includeBaseTasks: false,
        statuses: FAILED_STATUSES,
        tasks: [],
        variants: [],
      });
    });

    it("should return all task icons when there are no filters applied using the 'All' view", () => {
      expect(
        getMainlineCommitsQueryVariables({
          filterState: {
            requesters: [],
            statuses: [],
            tasks: [],
            variants: [],
            view: ProjectHealthView.All,
          },
          mainlineCommitOptions: {
            limit: 5,
            projectIdentifier: "projectIdentifier",
            skipOrderNumber: 0,
          },
        }).buildVariantOptionsForTaskIcons
      ).toStrictEqual({
        includeBaseTasks: false,
        statuses: [],
        tasks: [],
        variants: [],
      });
    });

    it("should not return any task icons when a non failing status filter is applied", () => {
      expect(
        getMainlineCommitsQueryVariables({
          filterState: {
            requesters: [],
            statuses: [TaskStatus.Succeeded],
            tasks: [],
            variants: [],
            view: ProjectHealthView.Failed,
          },
          mainlineCommitOptions: {
            limit: 5,
            projectIdentifier: "projectIdentifier",
            skipOrderNumber: 0,
          },
        }).buildVariantOptionsForTaskIcons
      ).toStrictEqual({
        includeBaseTasks: false,
        statuses: [],
        tasks: [impossibleMatch],
        variants: [],
      });
    });

    it("should return any task icons when a non failing status filter is applied using the 'All' view", () => {
      expect(
        getMainlineCommitsQueryVariables({
          filterState: {
            requesters: [],
            statuses: [TaskStatus.Succeeded],
            tasks: [],
            variants: [],
            view: ProjectHealthView.All,
          },
          mainlineCommitOptions: {
            limit: 5,
            projectIdentifier: "projectIdentifier",
            skipOrderNumber: 0,
          },
        }).buildVariantOptionsForTaskIcons
      ).toStrictEqual({
        includeBaseTasks: false,
        statuses: [TaskStatus.Succeeded],
        tasks: [],
        variants: [],
      });
    });

    it("should only show failing task icons when there are multiple statuses with mixed failing and non failing statuses", () => {
      expect(
        getMainlineCommitsQueryVariables({
          filterState: {
            requesters: [],
            statuses: [TaskStatus.Failed, TaskStatus.Succeeded],
            tasks: [],
            variants: [],
            view: ProjectHealthView.Failed,
          },
          mainlineCommitOptions: {
            limit: 5,
            projectIdentifier: "projectIdentifier",
            skipOrderNumber: 0,
          },
        }).buildVariantOptionsForTaskIcons
      ).toStrictEqual({
        includeBaseTasks: false,
        statuses: [TaskStatus.Failed],
        tasks: [],
        variants: [],
      });
    });
    it("should return all matching tasks when a task filter is applied regardless of status", () => {
      expect(
        getMainlineCommitsQueryVariables({
          filterState: {
            requesters: [],
            statuses: [],
            tasks: ["task1"],
            variants: [],
            view: ProjectHealthView.Failed,
          },
          mainlineCommitOptions: {
            limit: 5,
            projectIdentifier: "projectIdentifier",
            skipOrderNumber: 0,
          },
        }).buildVariantOptionsForTaskIcons
      ).toStrictEqual({
        includeBaseTasks: false,
        statuses: [],
        tasks: ["task1"],
        variants: [],
      });
      expect(
        getMainlineCommitsQueryVariables({
          filterState: {
            requesters: [],
            statuses: [TaskStatus.Succeeded],
            tasks: ["task1"],
            variants: [],
            view: ProjectHealthView.Failed,
          },
          mainlineCommitOptions: {
            limit: 5,
            projectIdentifier: "projectIdentifier",
            skipOrderNumber: 0,
          },
        }).buildVariantOptionsForTaskIcons
      ).toStrictEqual({
        includeBaseTasks: false,
        statuses: [TaskStatus.Succeeded],
        tasks: ["task1"],
        variants: [],
      });
    });
    it("should only return failing tasks when a variant filter is applied with no other filters", () => {
      expect(
        getMainlineCommitsQueryVariables({
          filterState: {
            requesters: [],
            statuses: [],
            tasks: [],
            variants: ["variant1"],
            view: ProjectHealthView.Failed,
          },
          mainlineCommitOptions: {
            limit: 5,
            projectIdentifier: "projectIdentifier",
            skipOrderNumber: 0,
          },
        }).buildVariantOptionsForTaskIcons
      ).toStrictEqual({
        includeBaseTasks: false,
        statuses: FAILED_STATUSES,
        tasks: [],
        variants: ["variant1"],
      });
    });
  });

  describe("buildVariantOptionsForGroupedTasks", () => {
    it("should not return any grouped tasks when there are no filters applied", () => {
      expect(
        getMainlineCommitsQueryVariables({
          filterState: {
            requesters: [],
            statuses: [],
            tasks: [],
            variants: [],
            view: ProjectHealthView.Failed,
          },
          mainlineCommitOptions: {
            limit: 5,
            projectIdentifier: "projectIdentifier",
            skipOrderNumber: 0,
          },
        }).buildVariantOptionsForGroupedTasks
      ).toStrictEqual({
        statuses: [],
        tasks: [impossibleMatch],
        variants: [],
      });
    });

    it("should not return any grouped tasks when there are no filters applied using the 'All' view", () => {
      expect(
        getMainlineCommitsQueryVariables({
          filterState: {
            requesters: [],
            statuses: [],
            tasks: [],
            variants: [],
            view: ProjectHealthView.All,
          },
          mainlineCommitOptions: {
            limit: 5,
            projectIdentifier: "projectIdentifier",
            skipOrderNumber: 0,
          },
        }).buildVariantOptionsForGroupedTasks
      ).toStrictEqual({
        statuses: [],
        tasks: [impossibleMatch],
        variants: [],
      });
    });

    it("should group statuses when a non failing status filter is applied", () => {
      expect(
        getMainlineCommitsQueryVariables({
          filterState: {
            requesters: [],
            statuses: [TaskStatus.Succeeded],
            tasks: [],
            variants: [],
            view: ProjectHealthView.Failed,
          },
          mainlineCommitOptions: {
            limit: 5,
            projectIdentifier: "projectIdentifier",
            skipOrderNumber: 0,
          },
        }).buildVariantOptionsForGroupedTasks
      ).toStrictEqual({
        statuses: [TaskStatus.Succeeded],
        tasks: [],
        variants: [],
      });
    });

    it("should not group statuses when a non failing status filter is applied using the 'All' view", () => {
      expect(
        getMainlineCommitsQueryVariables({
          filterState: {
            requesters: [],
            statuses: [TaskStatus.Succeeded],
            tasks: [],
            variants: [],
            view: ProjectHealthView.All,
          },
          mainlineCommitOptions: {
            limit: 5,
            projectIdentifier: "projectIdentifier",
            skipOrderNumber: 0,
          },
        }).buildVariantOptionsForGroupedTasks
      ).toStrictEqual({
        statuses: [],
        tasks: [impossibleMatch],
        variants: [],
      });
    });

    it("should not return groupings for failing statuses if there are multiple statuses", () => {
      expect(
        getMainlineCommitsQueryVariables({
          filterState: {
            requesters: [],
            statuses: [TaskStatus.Succeeded, TaskStatus.Failed],
            tasks: [],
            variants: [],
            view: ProjectHealthView.Failed,
          },
          mainlineCommitOptions: {
            limit: 5,
            projectIdentifier: "projectIdentifier",
            skipOrderNumber: 0,
          },
        }).buildVariantOptionsForGroupedTasks
      ).toStrictEqual({
        statuses: [TaskStatus.Succeeded],
        tasks: [],
        variants: [],
      });
    });
    it("should not return groupings for failing statuses if there are only failing statuses", () => {
      expect(
        getMainlineCommitsQueryVariables({
          filterState: {
            requesters: [],
            statuses: [TaskStatus.Failed],
            tasks: [],
            variants: [],
            view: ProjectHealthView.Failed,
          },
          mainlineCommitOptions: {
            limit: 5,
            projectIdentifier: "projectIdentifier",
            skipOrderNumber: 0,
          },
        }).buildVariantOptionsForGroupedTasks
      ).toStrictEqual({
        statuses: [],
        tasks: [impossibleMatch],
        variants: [],
      });
    });
    it("should not group failing statuses when there are other filters applied", () => {
      expect(
        getMainlineCommitsQueryVariables({
          filterState: {
            requesters: [],
            statuses: [],
            tasks: [],
            variants: ["variant1"],
            view: ProjectHealthView.Failed,
          },
          mainlineCommitOptions: {
            limit: 5,
            projectIdentifier: "projectIdentifier",
            skipOrderNumber: 0,
          },
        }).buildVariantOptionsForGroupedTasks
      ).toStrictEqual({
        statuses: ALL_NON_FAILING_STATUSES,
        tasks: [],
        variants: ["variant1"],
      });
    });
    it("should not return any task groupings if there are task filters applied", () => {
      expect(
        getMainlineCommitsQueryVariables({
          filterState: {
            requesters: [],
            statuses: [],
            tasks: ["task1"],
            variants: [],
            view: ProjectHealthView.Failed,
          },
          mainlineCommitOptions: {
            limit: 5,
            projectIdentifier: "projectIdentifier",
            skipOrderNumber: 0,
          },
        }).buildVariantOptionsForGroupedTasks
      ).toStrictEqual({
        statuses: [],
        tasks: [impossibleMatch],
        variants: [],
      });
      expect(
        getMainlineCommitsQueryVariables({
          filterState: {
            requesters: [],
            statuses: [TaskStatus.Failed],
            tasks: ["task1"],
            variants: [],
            view: ProjectHealthView.Failed,
          },
          mainlineCommitOptions: {
            limit: 5,
            projectIdentifier: "projectIdentifier",
            skipOrderNumber: 0,
          },
        }).buildVariantOptionsForGroupedTasks
      ).toStrictEqual({
        statuses: [],
        tasks: [impossibleMatch],
        variants: [],
      });
    });
  });
});

describe("getAllTaskStatsGroupedByColor", () => {
  it("grab the taskStatusStats.statusCounts field from all versions, returns mapping between version id to its {grouped task stats, max, total}", () => {
    expect(getAllTaskStatsGroupedByColor(versions)).toStrictEqual({
      "12": {
        max: 8,
        stats: [
          {
            color: red.base,
            count: 8,
            statusCounts: {
              [TaskStatus.TestTimedOut]: 6,
              [TaskStatus.Failed]: 2,
            },
            statuses: [
              taskStatusToCopy[TaskStatus.TestTimedOut],
              taskStatusToCopy[TaskStatus.Failed],
            ],
            umbrellaStatus: TaskStatus.FailedUmbrella,
          },
          {
            color: purple.dark2,
            count: 7,
            statusCounts: {
              [TaskStatus.SystemTimedOut]: 5,
              [TaskStatus.SystemUnresponsive]: 2,
            },
            statuses: [
              taskStatusToCopy[TaskStatus.SystemTimedOut],
              taskStatusToCopy[TaskStatus.SystemUnresponsive],
            ],
            umbrellaStatus: TaskStatus.SystemFailureUmbrella,
          },
          {
            color: yellow.base,
            count: 4,
            statusCounts: { [TaskStatus.Dispatched]: 4 },
            statuses: [taskStatusToCopy[TaskStatus.Dispatched]],
            umbrellaStatus: TaskStatus.RunningUmbrella,
          },
          {
            color: gray.base,
            count: 2,
            statusCounts: { [TaskStatus.WillRun]: 2 },
            statuses: [taskStatusToCopy[TaskStatus.WillRun]],
            umbrellaStatus: TaskStatus.ScheduledUmbrella,
          },
        ],
        total: 21,
      },
      "13": {
        max: 9,
        stats: [
          {
            color: green.dark1,
            count: 6,
            statusCounts: { [TaskStatus.Succeeded]: 6 },
            statuses: [taskStatusToCopy[TaskStatus.Succeeded]],
            umbrellaStatus: TaskStatus.Succeeded,
          },
          {
            color: red.base,
            count: 2,
            statusCounts: { [TaskStatus.Failed]: 2 },
            statuses: [taskStatusToCopy[TaskStatus.Failed]],
            umbrellaStatus: TaskStatus.FailedUmbrella,
          },
          {
            color: yellow.base,
            count: 9,
            statusCounts: {
              [TaskStatus.Dispatched]: 4,
              [TaskStatus.Started]: 5,
            },
            statuses: [
              taskStatusToCopy[TaskStatus.Dispatched],
              taskStatusToCopy[TaskStatus.Started],
            ],
            umbrellaStatus: TaskStatus.RunningUmbrella,
          },
        ],
        total: 17,
      },
      "14": {
        max: 7,
        stats: [
          {
            color: green.dark1,
            count: 4,
            statusCounts: { [TaskStatus.Succeeded]: 4 },
            statuses: [taskStatusToCopy[TaskStatus.Succeeded]],
            umbrellaStatus: TaskStatus.Succeeded,
          },
          {
            color: red.base,
            count: 6,
            statusCounts: { [TaskStatus.TaskTimedOut]: 6 },
            statuses: [taskStatusToCopy[TaskStatus.TaskTimedOut]],
            umbrellaStatus: TaskStatus.FailedUmbrella,
          },
          {
            color: purple.dark2,
            count: 7,
            statusCounts: {
              [TaskStatus.SystemFailed]: 5,
              [TaskStatus.SystemUnresponsive]: 2,
            },
            statuses: [
              taskStatusToCopy[TaskStatus.SystemFailed],
              taskStatusToCopy[TaskStatus.SystemUnresponsive],
            ],
            umbrellaStatus: TaskStatus.SystemFailureUmbrella,
          },
          {
            color: purple.light2,
            count: 3,
            statusCounts: { [TaskStatus.SetupFailed]: 3 },
            statuses: [taskStatusToCopy[TaskStatus.SetupFailed]],
            umbrellaStatus: TaskStatus.SetupFailed,
          },
          {
            color: yellow.base,
            count: 3,
            statusCounts: { started: 3 },
            statuses: [taskStatusToCopy[TaskStatus.Started]],
            umbrellaStatus: TaskStatus.RunningUmbrella,
          },
          {
            color: gray.dark1,
            count: 2,
            statusCounts: { [TaskStatus.Unscheduled]: 2 },
            statuses: [taskStatusToCopy[TaskStatus.Unscheduled]],
            umbrellaStatus: TaskStatus.UndispatchedUmbrella,
          },
        ],
        total: 25,
      },
      "123": {
        max: 7,
        stats: [
          {
            color: green.dark1,
            count: 4,
            statusCounts: { [TaskStatus.Succeeded]: 4 },
            statuses: [taskStatusToCopy[TaskStatus.Succeeded]],
            umbrellaStatus: TaskStatus.Succeeded,
          },
          {
            color: red.base,
            count: 6,
            statusCounts: { [TaskStatus.TaskTimedOut]: 6 },
            statuses: [taskStatusToCopy[TaskStatus.TaskTimedOut]],
            umbrellaStatus: TaskStatus.FailedUmbrella,
          },
          {
            color: purple.dark2,
            count: 7,
            statusCounts: {
              [TaskStatus.SystemFailed]: 5,
              [TaskStatus.SystemUnresponsive]: 2,
            },
            statuses: [
              taskStatusToCopy[TaskStatus.SystemFailed],
              taskStatusToCopy[TaskStatus.SystemUnresponsive],
            ],
            umbrellaStatus: TaskStatus.SystemFailureUmbrella,
          },
          {
            color: purple.light2,
            count: 3,
            statusCounts: { [TaskStatus.SetupFailed]: 3 },
            statuses: [taskStatusToCopy[TaskStatus.SetupFailed]],
            umbrellaStatus: TaskStatus.SetupFailed,
          },
          {
            color: yellow.base,
            count: 3,
            statusCounts: { started: 3 },
            statuses: [taskStatusToCopy[TaskStatus.Started]],
            umbrellaStatus: TaskStatus.RunningUmbrella,
          },
          {
            color: gray.dark1,
            count: 2,
            statusCounts: { [TaskStatus.Unscheduled]: 2 },
            statuses: [taskStatusToCopy[TaskStatus.Unscheduled]],
            umbrellaStatus: TaskStatus.UndispatchedUmbrella,
          },
        ],
        total: 25,
      },
    });
  });
});

describe("constructBuildVariantDict", () => {
  it("correctly determines priority, iconHeight, and badgeHeight", () => {
    expect(constructBuildVariantDict(versions)).toStrictEqual({
      "enterprise-macos-cxx20": {
        badgeHeight: GROUPED_BADGE_HEIGHT * 2 + GROUPED_BADGE_PADDING * 2,
        iconHeight: TASK_ICON_HEIGHT + TASK_ICON_PADDING * 2,
        priority: 4,
      },
      "enterprise-rhel-80-64-bit-inmem": {
        badgeHeight: 0,
        iconHeight: TASK_ICON_HEIGHT + TASK_ICON_PADDING * 2,
        priority: 1,
      },
      "enterprise-windows-benchmarks": {
        badgeHeight: 0,
        iconHeight: TASK_ICON_HEIGHT + TASK_ICON_PADDING * 2,
        priority: 2,
      },
    });
  });
});
