import { TaskStatus } from "types/task";
import {
  getMainlineCommitsQueryVariables,
  getFilterStatus,
  impossibleMatch,
  FAILED_STATUSES,
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
  it("should return the default query variables when we initially load the page with no filters", () => {
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
      })
    ).toStrictEqual({
      mainlineCommitsOptions: {
        limit: 5,
        projectID: "projectID",
        skipOrderNumber: 0,
        shouldCollapse: false,
        requesters: [],
      },
      buildVariantOptions: {
        tasks: [],
        variants: [],
        statuses: [],
      },
      buildVariantOptionsForGraph: {
        tasks: [],
        variants: [],
        statuses: [],
      },
      buildVariantOptionsForGroupedTasks: {
        tasks: [impossibleMatch],
        variants: [],
        statuses: [],
      },
      buildVariantOptionsForTaskIcons: {
        tasks: [],
        variants: [],
        statuses: [...FAILED_STATUSES],
      },
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
      })
    ).toStrictEqual({
      mainlineCommitsOptions: {
        limit: 5,
        projectID: "projectID",
        skipOrderNumber: 0,
        shouldCollapse: true,
        requesters: [],
      },
      buildVariantOptions: {
        tasks: ["test1"],
        variants: [],
        statuses: [],
      },
      buildVariantOptionsForGraph: {
        tasks: ["test1"],
        variants: [],
        statuses: [],
      },
      buildVariantOptionsForGroupedTasks: {
        tasks: [impossibleMatch],
        variants: [],
        statuses: [],
      },
      buildVariantOptionsForTaskIcons: {
        tasks: ["test1"],
        variants: [],
        statuses: [],
      },
    });
  });
  it("task filters should not group tasks", () => {
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
      })
    ).toStrictEqual({
      mainlineCommitsOptions: {
        limit: 5,
        projectID: "projectID",
        skipOrderNumber: 0,
        shouldCollapse: true,
        requesters: [],
      },
      buildVariantOptions: {
        tasks: ["task1"],
        variants: [],
        statuses: [],
      },
      buildVariantOptionsForGraph: {
        tasks: ["task1"],
        variants: [],
        statuses: [],
      },
      buildVariantOptionsForGroupedTasks: {
        tasks: [impossibleMatch],
        variants: [],
        statuses: [],
      },
      buildVariantOptionsForTaskIcons: {
        tasks: ["task1"],
        variants: [],
        statuses: [],
      },
    });
  });
  it("non failing status filters should return grouped status filters for tasks that match", () => {
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
      })
    ).toStrictEqual({
      mainlineCommitsOptions: {
        limit: 5,
        projectID: "projectID",
        skipOrderNumber: 0,
        shouldCollapse: true,
        requesters: [],
      },
      buildVariantOptions: {
        tasks: [],
        variants: [],
        statuses: [TaskStatus.Succeeded],
      },
      buildVariantOptionsForGraph: {
        tasks: [],
        variants: [],
        statuses: [TaskStatus.Succeeded],
      },
      buildVariantOptionsForGroupedTasks: {
        tasks: [],
        variants: [],
        statuses: [TaskStatus.Succeeded],
      },
      buildVariantOptionsForTaskIcons: {
        tasks: [impossibleMatch],
        variants: [],
        statuses: [],
      },
    });
  });
  it("failing status filters should not be grouped and should return task icons", () => {
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
      })
    ).toStrictEqual({
      mainlineCommitsOptions: {
        limit: 5,
        projectID: "projectID",
        skipOrderNumber: 0,
        shouldCollapse: true,
        requesters: [],
      },
      buildVariantOptions: {
        tasks: [],
        variants: [],
        statuses: [TaskStatus.Failed],
      },
      buildVariantOptionsForGraph: {
        tasks: [],
        variants: [],
        statuses: [TaskStatus.Failed],
      },
      buildVariantOptionsForGroupedTasks: {
        tasks: [impossibleMatch],
        variants: [],
        statuses: [],
      },
      buildVariantOptionsForTaskIcons: {
        tasks: [],
        variants: [],
        statuses: [TaskStatus.Failed],
      },
    });
  });
  it("failing and non failing status filters should only group the non failing ones", () => {
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
      })
    ).toStrictEqual({
      mainlineCommitsOptions: {
        limit: 5,
        projectID: "projectID",
        skipOrderNumber: 0,
        shouldCollapse: true,
        requesters: [],
      },
      buildVariantOptions: {
        tasks: [],
        variants: [],
        statuses: [TaskStatus.Failed, TaskStatus.Succeeded],
      },
      buildVariantOptionsForGraph: {
        tasks: [],
        variants: [],
        statuses: [TaskStatus.Failed, TaskStatus.Succeeded],
      },
      buildVariantOptionsForGroupedTasks: {
        tasks: [],
        variants: [],
        statuses: [TaskStatus.Succeeded],
      },
      buildVariantOptionsForTaskIcons: {
        tasks: [],
        variants: [],
        statuses: [TaskStatus.Failed],
      },
    });
  });
});
