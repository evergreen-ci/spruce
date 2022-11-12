import { TaskStatus } from "types/task";
import {
  getMainlineCommitsQueryVariables,
  getFilterStatus,
  impossibleMatch,
  FAILED_STATUSES,
  ALL_NON_FAILING_STATUSES,
} from "./utils";

describe("getFilterStatus", () => {
  it("should return an object containing booleans that describe what filters have been applied", () => {
    expect(
      getFilterStatus({
        statuses: ["failed"],
        tasks: ["task1"],
        variants: ["variant1"],
        requesters: ["requester1"],
        includeInactiveTasks: false,
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
        statuses: [],
        tasks: [],
        variants: [],
        requesters: [],
        includeInactiveTasks: false,
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
        statuses: [],
        tasks: ["task1"],
        variants: [],
        requesters: [],
        includeInactiveTasks: false,
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
          mainlineCommitOptions: {
            projectID: "projectID",
            limit: 5,
            skipOrderNumber: 0,
          },
          filterState: {
            statuses: [],
            tasks: [],
            variants: [],
            requesters: [],
            includeInactiveTasks: false,
          },
        }).mainlineCommitsOptions
      ).toStrictEqual({
        limit: 5,
        projectID: "projectID",
        skipOrderNumber: 0,
        shouldCollapse: false,
        requesters: [],
      });
    });
    it("filters should collapse commits", () => {
      expect(
        getMainlineCommitsQueryVariables({
          mainlineCommitOptions: {
            projectID: "projectID",
            limit: 5,
            skipOrderNumber: 0,
          },
          filterState: {
            statuses: [],
            tasks: ["test1"],
            variants: [],
            requesters: [],
            includeInactiveTasks: false,
          },
        }).mainlineCommitsOptions
      ).toStrictEqual({
        limit: 5,
        projectID: "projectID",
        skipOrderNumber: 0,
        shouldCollapse: true,
        requesters: [],
      });
      expect(
        getMainlineCommitsQueryVariables({
          mainlineCommitOptions: {
            projectID: "projectID",
            limit: 5,
            skipOrderNumber: 0,
          },
          filterState: {
            statuses: [TaskStatus.Succeeded],
            tasks: [],
            variants: [],
            requesters: [],
            includeInactiveTasks: false,
          },
        }).mainlineCommitsOptions
      ).toStrictEqual({
        limit: 5,
        projectID: "projectID",
        skipOrderNumber: 0,
        shouldCollapse: true,
        requesters: [],
      });
      expect(
        getMainlineCommitsQueryVariables({
          mainlineCommitOptions: {
            projectID: "projectID",
            limit: 5,
            skipOrderNumber: 0,
          },
          filterState: {
            statuses: [],
            tasks: ["test1"],
            variants: [],
            requesters: [],
            includeInactiveTasks: false,
          },
        }).mainlineCommitsOptions
      ).toStrictEqual({
        limit: 5,
        projectID: "projectID",
        skipOrderNumber: 0,
        shouldCollapse: true,
        requesters: [],
      });
      expect(
        getMainlineCommitsQueryVariables({
          mainlineCommitOptions: {
            projectID: "projectID",
            limit: 5,
            skipOrderNumber: 0,
          },
          filterState: {
            statuses: [],
            tasks: [],
            variants: ["test1"],
            requesters: [],
            includeInactiveTasks: false,
          },
        }).mainlineCommitsOptions
      ).toStrictEqual({
        limit: 5,
        projectID: "projectID",
        skipOrderNumber: 0,
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
            projectID: "projectID",
            limit: 5,
            skipOrderNumber: 0,
          },
          filterState: {
            statuses: [],
            tasks: [],
            variants: [],
            requesters: [],
            includeInactiveTasks: false,
          },
        }).buildVariantOptions
      ).toStrictEqual({
        tasks: [],
        variants: [],
        statuses: [],
        includeBaseTasks: false,
        includeInactiveTasks: false,
      });
      expect(
        getMainlineCommitsQueryVariables({
          mainlineCommitOptions: {
            projectID: "projectID",
            limit: 5,
            skipOrderNumber: 0,
          },
          filterState: {
            statuses: [TaskStatus.Failed],
            tasks: [],
            variants: [],
            requesters: [],
            includeInactiveTasks: false,
          },
        }).buildVariantOptions
      ).toStrictEqual({
        tasks: [],
        variants: [],
        statuses: [TaskStatus.Failed],
        includeBaseTasks: false,
        includeInactiveTasks: false,
      });
      expect(
        getMainlineCommitsQueryVariables({
          mainlineCommitOptions: {
            projectID: "projectID",
            limit: 5,
            skipOrderNumber: 0,
          },
          filterState: {
            statuses: [],
            tasks: ["task1"],
            variants: [],
            requesters: [],
            includeInactiveTasks: false,
          },
        }).buildVariantOptions
      ).toStrictEqual({
        tasks: ["task1"],
        variants: [],
        statuses: [],
        includeBaseTasks: false,
        includeInactiveTasks: false,
      });
    });
  });
  describe("buildVariantOptionsForGraph", () => {
    it("should return no task filters by default", () => {
      expect(
        getMainlineCommitsQueryVariables({
          mainlineCommitOptions: {
            projectID: "projectID",
            limit: 5,
            skipOrderNumber: 0,
          },
          filterState: {
            statuses: [],
            tasks: [],
            variants: [],
            requesters: [],
            includeInactiveTasks: false,
          },
        }).buildVariantOptionsForGraph
      ).toStrictEqual({
        tasks: [],
        variants: [],
        statuses: [],
        includeInactiveTasks: false,
      });
    });
    it("should apply all filters when they are provided", () => {
      expect(
        getMainlineCommitsQueryVariables({
          mainlineCommitOptions: {
            projectID: "projectID",
            limit: 5,
            skipOrderNumber: 0,
          },
          filterState: {
            statuses: [TaskStatus.Failed],
            tasks: [],
            variants: [],
            requesters: [],
            includeInactiveTasks: false,
          },
        }).buildVariantOptionsForGraph
      ).toStrictEqual({
        tasks: [],
        variants: [],
        statuses: [TaskStatus.Failed],
        includeInactiveTasks: false,
      });
      expect(
        getMainlineCommitsQueryVariables({
          mainlineCommitOptions: {
            projectID: "projectID",
            limit: 5,
            skipOrderNumber: 0,
          },
          filterState: {
            statuses: [],
            tasks: ["task1"],
            variants: [],
            requesters: [],
            includeInactiveTasks: false,
          },
        }).buildVariantOptionsForGraph
      ).toStrictEqual({
        tasks: ["task1"],
        variants: [],
        statuses: [],
        includeInactiveTasks: false,
      });
      expect(
        getMainlineCommitsQueryVariables({
          mainlineCommitOptions: {
            projectID: "projectID",
            limit: 5,
            skipOrderNumber: 0,
          },
          filterState: {
            statuses: [],
            tasks: [],
            variants: ["variant1"],
            requesters: [],
            includeInactiveTasks: false,
          },
        }).buildVariantOptionsForGraph
      ).toStrictEqual({
        tasks: [],
        variants: ["variant1"],
        statuses: [],
        includeInactiveTasks: false,
      });
    });
  });
  describe("buildVariantOptionsForTaskIcons", () => {
    it("should only return failing task icons when there are no filters applied", () => {
      expect(
        getMainlineCommitsQueryVariables({
          mainlineCommitOptions: {
            projectID: "projectID",
            limit: 5,
            skipOrderNumber: 0,
          },
          filterState: {
            statuses: [],
            tasks: [],
            variants: [],
            requesters: [],
            includeInactiveTasks: false,
          },
        }).buildVariantOptionsForTaskIcons
      ).toStrictEqual({
        tasks: [],
        variants: [],
        statuses: FAILED_STATUSES,
        includeBaseTasks: false,
        includeInactiveTasks: false,
      });
    });
    it("should not return any task icons when a non failing status filter is applied", () => {
      expect(
        getMainlineCommitsQueryVariables({
          mainlineCommitOptions: {
            projectID: "projectID",
            limit: 5,
            skipOrderNumber: 0,
          },
          filterState: {
            statuses: [TaskStatus.Succeeded],
            tasks: [],
            variants: [],
            requesters: [],
            includeInactiveTasks: false,
          },
        }).buildVariantOptionsForTaskIcons
      ).toStrictEqual({
        tasks: [impossibleMatch],
        variants: [],
        statuses: [],
        includeBaseTasks: false,
        includeInactiveTasks: false,
      });
    });
    it("should only show failing task icons when there are multiple statuses with mixed failing and non failing statuses", () => {
      expect(
        getMainlineCommitsQueryVariables({
          mainlineCommitOptions: {
            projectID: "projectID",
            limit: 5,
            skipOrderNumber: 0,
          },
          filterState: {
            statuses: [TaskStatus.Failed, TaskStatus.Succeeded],
            tasks: [],
            variants: [],
            requesters: [],
            includeInactiveTasks: false,
          },
        }).buildVariantOptionsForTaskIcons
      ).toStrictEqual({
        tasks: [],
        variants: [],
        statuses: [TaskStatus.Failed],
        includeBaseTasks: false,
        includeInactiveTasks: false,
      });
    });
    it("should return all matching tasks when a task filter is applied regardless of status", () => {
      expect(
        getMainlineCommitsQueryVariables({
          mainlineCommitOptions: {
            projectID: "projectID",
            limit: 5,
            skipOrderNumber: 0,
          },
          filterState: {
            statuses: [],
            tasks: ["task1"],
            variants: [],
            requesters: [],
            includeInactiveTasks: false,
          },
        }).buildVariantOptionsForTaskIcons
      ).toStrictEqual({
        tasks: ["task1"],
        variants: [],
        statuses: [],
        includeBaseTasks: false,
        includeInactiveTasks: false,
      });
      expect(
        getMainlineCommitsQueryVariables({
          mainlineCommitOptions: {
            projectID: "projectID",
            limit: 5,
            skipOrderNumber: 0,
          },
          filterState: {
            statuses: [TaskStatus.Succeeded],
            tasks: ["task1"],
            variants: [],
            requesters: [],
            includeInactiveTasks: false,
          },
        }).buildVariantOptionsForTaskIcons
      ).toStrictEqual({
        tasks: ["task1"],
        variants: [],
        statuses: [TaskStatus.Succeeded],
        includeBaseTasks: false,
        includeInactiveTasks: false,
      });
    });
    it("should only return failing tasks when a variant filter is applied with no other filters", () => {
      expect(
        getMainlineCommitsQueryVariables({
          mainlineCommitOptions: {
            projectID: "projectID",
            limit: 5,
            skipOrderNumber: 0,
          },
          filterState: {
            statuses: [],
            tasks: [],
            variants: ["variant1"],
            requesters: [],
            includeInactiveTasks: false,
          },
        }).buildVariantOptionsForTaskIcons
      ).toStrictEqual({
        tasks: [],
        variants: ["variant1"],
        statuses: FAILED_STATUSES,
        includeBaseTasks: false,
        includeInactiveTasks: false,
      });
    });
  });

  describe("buildVariantOptionsForGroupedTasks", () => {
    it("should not return any grouped tasks when there are no filters applied", () => {
      expect(
        getMainlineCommitsQueryVariables({
          mainlineCommitOptions: {
            projectID: "projectID",
            limit: 5,
            skipOrderNumber: 0,
          },
          filterState: {
            statuses: [],
            tasks: [],
            variants: [],
            requesters: [],
            includeInactiveTasks: false,
          },
        }).buildVariantOptionsForGroupedTasks
      ).toStrictEqual({
        tasks: [impossibleMatch],
        statuses: [],
        variants: [],
        includeBaseTasks: false,
        includeInactiveTasks: false,
      });
    });
    it("should group statuses when a non failing status filter is applied", () => {
      expect(
        getMainlineCommitsQueryVariables({
          mainlineCommitOptions: {
            projectID: "projectID",
            limit: 5,
            skipOrderNumber: 0,
          },
          filterState: {
            statuses: [TaskStatus.Succeeded],
            tasks: [],
            variants: [],
            requesters: [],
            includeInactiveTasks: false,
          },
        }).buildVariantOptionsForGroupedTasks
      ).toStrictEqual({
        tasks: [],
        variants: [],
        statuses: [TaskStatus.Succeeded],
        includeBaseTasks: false,
        includeInactiveTasks: false,
      });
    });
    it("should not return groupings for failing statuses if there are multiple statuses", () => {
      expect(
        getMainlineCommitsQueryVariables({
          mainlineCommitOptions: {
            projectID: "projectID",
            limit: 5,
            skipOrderNumber: 0,
          },
          filterState: {
            statuses: [TaskStatus.Succeeded, TaskStatus.Failed],
            tasks: [],
            variants: [],
            requesters: [],
            includeInactiveTasks: false,
          },
        }).buildVariantOptionsForGroupedTasks
      ).toStrictEqual({
        tasks: [],
        variants: [],
        statuses: [TaskStatus.Succeeded],
        includeBaseTasks: false,
        includeInactiveTasks: false,
      });
    });
    it("should not return groupings for failing statuses if there are only failing statuses", () => {
      expect(
        getMainlineCommitsQueryVariables({
          mainlineCommitOptions: {
            projectID: "projectID",
            limit: 5,
            skipOrderNumber: 0,
          },
          filterState: {
            statuses: [TaskStatus.Failed],
            tasks: [],
            variants: [],
            requesters: [],
            includeInactiveTasks: false,
          },
        }).buildVariantOptionsForGroupedTasks
      ).toStrictEqual({
        tasks: [impossibleMatch],
        variants: [],
        statuses: [],
        includeBaseTasks: false,
        includeInactiveTasks: false,
      });
    });
    it("should not group failing statuses when there are other filters applied", () => {
      expect(
        getMainlineCommitsQueryVariables({
          mainlineCommitOptions: {
            projectID: "projectID",
            limit: 5,
            skipOrderNumber: 0,
          },
          filterState: {
            statuses: [],
            tasks: [],
            variants: ["variant1"],
            requesters: [],
            includeInactiveTasks: false,
          },
        }).buildVariantOptionsForGroupedTasks
      ).toStrictEqual({
        tasks: [],
        variants: ["variant1"],
        statuses: ALL_NON_FAILING_STATUSES,
        includeBaseTasks: false,
        includeInactiveTasks: false,
      });
    });
    it("should not return any task groupings if there are task filters applied", () => {
      expect(
        getMainlineCommitsQueryVariables({
          mainlineCommitOptions: {
            projectID: "projectID",
            limit: 5,
            skipOrderNumber: 0,
          },
          filterState: {
            statuses: [],
            tasks: ["task1"],
            variants: [],
            requesters: [],
            includeInactiveTasks: false,
          },
        }).buildVariantOptionsForGroupedTasks
      ).toStrictEqual({
        tasks: [impossibleMatch],
        variants: [],
        statuses: [],
        includeBaseTasks: false,
        includeInactiveTasks: false,
      });
      expect(
        getMainlineCommitsQueryVariables({
          mainlineCommitOptions: {
            projectID: "projectID",
            limit: 5,
            skipOrderNumber: 0,
          },
          filterState: {
            statuses: [TaskStatus.Failed],
            tasks: ["task1"],
            variants: [],
            requesters: [],
            includeInactiveTasks: false,
          },
        }).buildVariantOptionsForGroupedTasks
      ).toStrictEqual({
        tasks: [impossibleMatch],
        variants: [],
        statuses: [],
        includeBaseTasks: false,
        includeInactiveTasks: false,
      });
    });
  });
});
