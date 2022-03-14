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
          },
        }).buildVariantOptions
      ).toStrictEqual({
        tasks: [],
        variants: [],
        statuses: [],
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
          },
        }).buildVariantOptions
      ).toStrictEqual({
        tasks: [],
        variants: [],
        statuses: [TaskStatus.Failed],
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
          },
        }).buildVariantOptions
      ).toStrictEqual({
        tasks: ["task1"],
        variants: [],
        statuses: [],
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
          },
        }).buildVariantOptionsForGraph
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
            projectID: "projectID",
            limit: 5,
            skipOrderNumber: 0,
          },
          filterState: {
            statuses: [TaskStatus.Failed],
            tasks: [],
            variants: [],
            requesters: [],
          },
        }).buildVariantOptionsForGraph
      ).toStrictEqual({
        tasks: [],
        variants: [],
        statuses: [TaskStatus.Failed],
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
          },
        }).buildVariantOptionsForGraph
      ).toStrictEqual({
        tasks: ["task1"],
        variants: [],
        statuses: [],
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
          },
        }).buildVariantOptionsForGraph
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
            projectID: "projectID",
            limit: 5,
            skipOrderNumber: 0,
          },
          filterState: {
            statuses: [],
            tasks: [],
            variants: [],
            requesters: [],
          },
        }).buildVariantOptionsForTaskIcons
      ).toStrictEqual({
        tasks: [],
        variants: [],
        statuses: FAILED_STATUSES,
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
          },
        }).buildVariantOptionsForTaskIcons
      ).toStrictEqual({
        tasks: [impossibleMatch],
        variants: [],
        statuses: [],
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
          },
        }).buildVariantOptionsForTaskIcons
      ).toStrictEqual({
        tasks: [],
        variants: [],
        statuses: [TaskStatus.Failed],
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
          },
        }).buildVariantOptionsForTaskIcons
      ).toStrictEqual({
        tasks: ["task1"],
        variants: [],
        statuses: [],
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
          },
        }).buildVariantOptionsForTaskIcons
      ).toStrictEqual({
        tasks: ["task1"],
        variants: [],
        statuses: [TaskStatus.Succeeded],
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
          },
        }).buildVariantOptionsForTaskIcons
      ).toStrictEqual({
        tasks: [],
        variants: ["variant1"],
        statuses: FAILED_STATUSES,
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
          },
        }).buildVariantOptionsForGroupedTasks
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
            projectID: "projectID",
            limit: 5,
            skipOrderNumber: 0,
          },
          filterState: {
            statuses: [TaskStatus.Succeeded],
            tasks: [],
            variants: [],
            requesters: [],
          },
        }).buildVariantOptionsForGroupedTasks
      ).toStrictEqual({
        tasks: [],
        variants: [],
        statuses: [TaskStatus.Succeeded],
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
          },
        }).buildVariantOptionsForGroupedTasks
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
            projectID: "projectID",
            limit: 5,
            skipOrderNumber: 0,
          },
          filterState: {
            statuses: [TaskStatus.Failed],
            tasks: [],
            variants: [],
            requesters: [],
          },
        }).buildVariantOptionsForGroupedTasks
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
            projectID: "projectID",
            limit: 5,
            skipOrderNumber: 0,
          },
          filterState: {
            statuses: [],
            tasks: [],
            variants: ["variant1"],
            requesters: [],
          },
        }).buildVariantOptionsForGroupedTasks
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
            projectID: "projectID",
            limit: 5,
            skipOrderNumber: 0,
          },
          filterState: {
            statuses: [],
            tasks: ["task1"],
            variants: [],
            requesters: [],
          },
        }).buildVariantOptionsForGroupedTasks
      ).toStrictEqual({
        tasks: [impossibleMatch],
        variants: [],
        statuses: [],
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
          },
        }).buildVariantOptionsForGroupedTasks
      ).toStrictEqual({
        tasks: [impossibleMatch],
        variants: [],
        statuses: [],
      });
    });
  });
});
