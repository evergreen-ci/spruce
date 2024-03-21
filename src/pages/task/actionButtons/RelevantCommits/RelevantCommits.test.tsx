import { MockedProvider } from "@apollo/client/testing";
import { RenderFakeToastContext } from "context/toast/__mocks__";
import {
  BaseVersionAndTaskQuery,
  BaseVersionAndTaskQueryVariables,
  LastMainlineCommitQuery,
  LastMainlineCommitQueryVariables,
} from "gql/generated/types";
import { taskQuery } from "gql/mocks/taskData";
import { BASE_VERSION_AND_TASK, LAST_MAINLINE_COMMIT } from "gql/queries";
import { renderWithRouterMatch, screen, userEvent, waitFor } from "test_utils";
import { ApolloMock } from "types/gql";
import { RelevantCommits } from ".";

describe("relevant commits", () => {
  // Patch and mainline commit behavior only have a significant difference when it comes to determining
  // the base or previous task. Patch gets the base task directly from BASE_VERSION_AND_TASK, while
  // mainline commits needs to run another query LAST_MAINLINE_COMMIT to get previous task.
  describe("patch specific", () => {
    it("the button is disabled when there is no base task", async () => {
      const { Component } = RenderFakeToastContext(
        <MockedProvider mocks={[getPatchTaskWithNoBaseTask]}>
          <RelevantCommits task={patchTaskWithNoBaseTask} />
        </MockedProvider>,
      );
      renderWithRouterMatch(<Component />);
      await waitFor(() => {
        expect(
          screen.getByRole("button", { name: "Relevant commits" }),
        ).toHaveAttribute("aria-disabled", "true");
      });
    });
  });

  describe("mainline commits specific", () => {
    it("the button is disabled when getParentTask returns null", async () => {
      const { Component } = RenderFakeToastContext(
        <MockedProvider
          mocks={[getMainlineTaskWithBaseVersion, getNullParentTask]}
        >
          <RelevantCommits task={mainlineTaskWithBaseVersion} />
        </MockedProvider>,
      );
      renderWithRouterMatch(<Component />);

      await waitFor(() => {
        expect(
          screen.getByRole("button", { name: "Relevant commits" }),
        ).toHaveAttribute("aria-disabled", "true");
      });
    });

    it("the button is disabled when getParentTask returns an error", async () => {
      const { Component } = RenderFakeToastContext(
        <MockedProvider
          mocks={[getMainlineTaskWithBaseVersion, getParentTaskWithError]}
        >
          <RelevantCommits task={mainlineTaskWithBaseVersion} />
        </MockedProvider>,
      );
      renderWithRouterMatch(<Component />);

      await waitFor(() => {
        expect(
          screen.getByRole("button", { name: "Relevant commits" }),
        ).toHaveAttribute("aria-disabled", "true");
      });
    });
  });

  it("the button is disabled when no base version exists", async () => {
    const { Component } = RenderFakeToastContext(
      <MockedProvider mocks={[getPatchTaskWithNoBaseVersion]}>
        <RelevantCommits task={patchTaskWithNoBaseVersion} />
      </MockedProvider>,
    );
    renderWithRouterMatch(<Component />);

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: "Relevant commits" }),
      ).toHaveAttribute("aria-disabled", "true");
    });
  });

  it("when base task is passing, last passing, base commit, and last executed dropdown items generate the same link and breaking commit is disabled", async () => {
    const user = userEvent.setup();
    const { Component } = RenderFakeToastContext(
      <MockedProvider
        mocks={[
          getPatchTaskWithSuccessfulBaseTask,
          getLastPassingVersion,
          getLastExecutedVersion,
        ]}
      >
        <RelevantCommits task={patchTaskWithSuccessfulBaseTask} />
      </MockedProvider>,
    );
    renderWithRouterMatch(<Component />);

    await screen.findByRole("button", { name: "Relevant commits" });
    expect(
      screen.getByRole("button", { name: "Relevant commits" }),
    ).toHaveAttribute("aria-disabled", "false");
    await user.click(screen.getByRole("button", { name: "Relevant commits" }));
    await waitFor(() => {
      expect(screen.getByRole("menu")).toBeVisible();
    });

    expect(
      screen.getByRole("menuitem", { name: "Go to base commit" }),
    ).toHaveAttribute("href", baseTaskHref);
    expect(
      screen.getByRole("menuitem", { name: "Go to last passing version" }),
    ).toHaveAttribute("href", baseTaskHref);
    expect(
      screen.getByRole("menuitem", { name: "Go to last executed version" }),
    ).toHaveAttribute("href", baseTaskHref);
    expect(
      screen.getByRole("menuitem", { name: "Go to breaking commit" }),
    ).toHaveAttribute("aria-disabled", "true");
  });

  it("when base task is failing, 'Go to base commit' and 'Go to last executed' dropdown items generate the same link and 'Go to last passing version' will be different and 'Go to breaking commit' will be populated", async () => {
    const user = userEvent.setup();
    const { Component } = RenderFakeToastContext(
      <MockedProvider
        mocks={[
          getPatchTaskWithFailingBaseTask,
          getLastPassingVersion,
          getBreakingCommit,
        ]}
      >
        <RelevantCommits task={patchTaskWithFailingBaseTask} />
      </MockedProvider>,
    );
    renderWithRouterMatch(<Component />);

    await screen.findByRole("button", { name: "Relevant commits" });
    expect(
      screen.getByRole("button", { name: "Relevant commits" }),
    ).toHaveAttribute("aria-disabled", "false");
    await user.click(screen.getByRole("button", { name: "Relevant commits" }));
    await waitFor(() => {
      expect(screen.getByRole("menu")).toBeVisible();
    });

    expect(
      screen.getByRole("menuitem", { name: "Go to base commit" }),
    ).toHaveAttribute("href", baseTaskHref);
    expect(
      screen.getByRole("menuitem", { name: "Go to last passing version" }),
    ).toHaveAttribute("href", "/task/last_passing_task");
    expect(
      screen.getByRole("menuitem", { name: "Go to last executed version" }),
    ).toHaveAttribute("href", baseTaskHref);
    expect(
      screen.getByRole("menuitem", { name: "Go to breaking commit" }),
    ).toHaveAttribute("href", "/task/breaking_commit");
  });

  it("when base task is not in a finished state, the last executed, and passing task are not the same as the base commit and breaking commit is empty", async () => {
    const user = userEvent.setup();
    const { Component } = RenderFakeToastContext(
      <MockedProvider
        mocks={[
          getPatchTaskWithRunningBaseTask,
          getLastPassingVersion,
          getLastExecutedVersion,
          getBreakingCommit,
        ]}
      >
        <RelevantCommits task={patchTaskWithRunningBaseTask} />
      </MockedProvider>,
    );
    renderWithRouterMatch(<Component />);

    await screen.findByRole("button", { name: "Relevant commits" });
    expect(
      screen.getByRole("button", { name: "Relevant commits" }),
    ).toHaveAttribute("aria-disabled", "false");
    await user.click(screen.getByRole("button", { name: "Relevant commits" }));
    await waitFor(() => {
      expect(screen.getByRole("menu")).toBeVisible();
    });

    expect(
      screen.getByRole("menuitem", { name: "Go to base commit" }),
    ).toHaveAttribute("href", baseTaskHref);
    expect(
      screen.getByRole("menuitem", { name: "Go to last passing version" }),
    ).toHaveAttribute("href", "/task/last_passing_task");
    expect(
      screen.getByRole("menuitem", { name: "Go to last executed version" }),
    ).toHaveAttribute("href", "/task/last_executed_task");
    expect(
      screen.getByRole("menuitem", { name: "Go to breaking commit" }),
    ).toHaveAttribute("aria-disabled", "true");
  });
});

const baseTaskId =
  "evergreen_lint_lint_agent_f4fe4814088e13b8ef423a73d65a6e0a5579cf93_21_11_29_17_55_27";
const baseTaskHref = `/task/${baseTaskId}`;

const patchTaskWithSuccessfulBaseTask = {
  ...taskQuery.task,
  id: "evergreen_lint_lint_agent_patch_f4fe4814088e13b8ef423a73d65a6e0a5579cf93_61a8edf132f41750ab47bc72_21_12_02_16_01_54",
  execution: 0,
  displayName: "lint-agent",
  buildVariant: "lint",
  projectIdentifier: "evergreen",
  status: "success",
  versionMetadata: {
    baseVersion: {
      id: "baseVersion",
      order: 3676,
      __typename: "Version" as const,
    },
    isPatch: true,
    author: "author",
    message: "message",
    project: "project",
    projectIdentifier: "projectIdentifier",
    revision: "revision",
    order: 3676,
    id: "versionMetadataId",
    __typename: "Version" as const,
  },
  baseTask: {
    ...taskQuery.task,
    id: baseTaskId,
    execution: 0,
    status: "success",
    __typename: "Task" as const,
  },
  __typename: "Task" as const,
};

const getPatchTaskWithSuccessfulBaseTask: ApolloMock<
  BaseVersionAndTaskQuery,
  BaseVersionAndTaskQueryVariables
> = {
  request: {
    query: BASE_VERSION_AND_TASK,
    variables: {
      taskId: "t1",
    },
  },
  result: {
    data: {
      task: patchTaskWithSuccessfulBaseTask,
    },
  },
};

const patchTaskWithRunningBaseTask = {
  ...taskQuery.task,
  id: "evergreen_lint_lint_agent_patch_f4fe4814088e13b8ef423a73d65a6e0a5579cf93_61a8edf132f41750ab47bc72_21_12_02_16_01_54",
  execution: 0,
  displayName: "lint-agent",
  buildVariant: "lint",
  projectIdentifier: "evergreen",
  status: "started",
  versionMetadata: {
    baseVersion: {
      id: "baseVersion",
      order: 3676,
      __typename: "Version" as const,
    },
    isPatch: true,
    author: "author",
    message: "message",
    project: "project",
    projectIdentifier: "projectIdentifier",
    revision: "revision",
    order: 3676,
    id: "versionMetadataId",
    __typename: "Version" as const,
  },
  baseTask: {
    ...taskQuery.task,
    id: baseTaskId,
    execution: 0,
    status: "started",
    __typename: "Task" as const,
  },
  __typename: "Task" as const,
};

const getPatchTaskWithRunningBaseTask: ApolloMock<
  BaseVersionAndTaskQuery,
  BaseVersionAndTaskQueryVariables
> = {
  request: {
    query: BASE_VERSION_AND_TASK,
    variables: {
      taskId: "t3",
    },
  },
  result: {
    data: {
      task: patchTaskWithRunningBaseTask,
    },
  },
};

const patchTaskWithFailingBaseTask = {
  ...taskQuery.task,
  id: "evergreen_lint_lint_agent_patch_f4fe4814088e13b8ef423a73d65a6e0a5579cf93_61a8edf132f41750ab47bc72_21_12_02_16_01_54",
  execution: 0,
  displayName: "lint-agent",
  buildVariant: "lint",
  projectIdentifier: "evergreen",
  status: "failed",
  versionMetadata: {
    baseVersion: {
      id: "baseVersion",
      order: 3676,
      __typename: "Version" as const,
    },
    isPatch: true,
    author: "author",
    message: "message",
    order: 3676,
    project: "project",
    projectIdentifier: "projectIdentifier",
    revision: "revision",
    id: "versionMetadataId",
    __typename: "Version" as const,
  },
  baseTask: {
    ...taskQuery.task,
    id: baseTaskId,
    execution: 0,
    status: "failed",
    __typename: "Task" as const,
  },
  __typename: "Task" as const,
};

const getPatchTaskWithFailingBaseTask: ApolloMock<
  BaseVersionAndTaskQuery,
  BaseVersionAndTaskQueryVariables
> = {
  request: {
    query: BASE_VERSION_AND_TASK,
    variables: {
      taskId: "t1",
    },
  },
  result: {
    data: {
      task: patchTaskWithFailingBaseTask,
    },
  },
};

const patchTaskWithNoBaseVersion = {
  ...taskQuery.task,
  id: "evergreen_lint_lint_agent_patch_f4fe4814088e13b8ef423a73d65a6e0a5579cf93_61a8edf132f41750ab47bc72_21_12_02_16_01_54",
  execution: 0,
  displayName: "lint-agent",
  buildVariant: "lint",
  projectIdentifier: "evergreen",
  status: "success",
  versionMetadata: {
    baseVersion: null,
    id: "versionMetadataId",
    isPatch: true,
    author: "author",
    message: "message",
    order: 3676,
    project: "project",
    projectIdentifier: "projectIdentifier",
    revision: "revision",
    __typename: "Version" as const,
  },
  baseTask: null,
  __typename: "Task" as const,
};

const getPatchTaskWithNoBaseVersion: ApolloMock<
  BaseVersionAndTaskQuery,
  BaseVersionAndTaskQueryVariables
> = {
  request: {
    query: BASE_VERSION_AND_TASK,
    variables: {
      taskId: "t3",
    },
  },
  result: {
    data: {
      task: patchTaskWithNoBaseVersion,
    },
  },
};

const getBreakingCommit: ApolloMock<
  LastMainlineCommitQuery,
  LastMainlineCommitQueryVariables
> = {
  request: {
    query: LAST_MAINLINE_COMMIT,
    variables: {
      projectIdentifier: "evergreen",
      skipOrderNumber: 3676,
      buildVariantOptions: {
        tasks: ["^lint-agent$"],
        variants: ["^lint$"],
        statuses: ["failed"],
      },
    },
  },
  result: {
    data: {
      mainlineCommits: {
        versions: [
          {
            version: {
              id: "evergreen_44110b57c6977bf3557009193628c9389772163f2",
              buildVariants: [
                {
                  tasks: [
                    {
                      id: "breaking_commit",
                      execution: 0,
                      order: 3676,
                      status: "failed",
                      __typename: "Task",
                    },
                  ],
                  __typename: "GroupedBuildVariant",
                },
              ],
              __typename: "Version",
            },
            __typename: "MainlineCommitVersion",
          },
        ],
        __typename: "MainlineCommits",
      },
    },
  },
};

const getLastPassingVersion: ApolloMock<
  LastMainlineCommitQuery,
  LastMainlineCommitQueryVariables
> = {
  request: {
    query: LAST_MAINLINE_COMMIT,
    variables: {
      projectIdentifier: "evergreen",
      skipOrderNumber: 3676,
      buildVariantOptions: {
        tasks: ["^lint-agent$"],
        variants: ["^lint$"],
        statuses: ["success"],
      },
    },
  },
  result: {
    data: {
      mainlineCommits: {
        versions: [
          {
            version: {
              id: "evergreen_44110b57c6977bf3557009193628c9389772163f",
              buildVariants: [
                {
                  tasks: [
                    {
                      id: "last_passing_task",
                      execution: 0,
                      order: 3674,
                      status: "success",
                      __typename: "Task",
                    },
                  ],
                  __typename: "GroupedBuildVariant",
                },
              ],
              __typename: "Version",
            },
            __typename: "MainlineCommitVersion",
          },
        ],
        __typename: "MainlineCommits",
      },
    },
  },
};

const getLastExecutedVersion: ApolloMock<
  LastMainlineCommitQuery,
  LastMainlineCommitQueryVariables
> = {
  request: {
    query: LAST_MAINLINE_COMMIT,
    variables: {
      projectIdentifier: "evergreen",
      skipOrderNumber: 3676,
      buildVariantOptions: {
        tasks: ["^lint-agent$"],
        variants: ["^lint$"],
        statuses: [
          "failed",
          "setup-failed",
          "system-failed",
          "task-timed-out",
          "test-timed-out",
          "known-issue",
          "system-unresponsive",
          "system-timed-out",
          "success",
        ],
      },
    },
  },
  result: {
    data: {
      mainlineCommits: {
        versions: [
          {
            version: {
              id: "evergreen_44110b57c6977bf3557009193628c9389772163f",
              buildVariants: [
                {
                  tasks: [
                    {
                      id: "last_executed_task",
                      execution: 0,
                      order: 3676,
                      status: "failed",
                      __typename: "Task",
                    },
                  ],
                  __typename: "GroupedBuildVariant",
                },
              ],
              __typename: "Version",
            },
            __typename: "MainlineCommitVersion",
          },
        ],
        __typename: "MainlineCommits",
      },
    },
  },
};

const patchTaskWithNoBaseTask = {
  ...taskQuery.task,
  id: "evergreen_lint_lint_agent_patch_f4fe4814088e13b8ef423a73d65a6e0a5579cf93_61a8edf132f41750ab47bc72_21_12_02_16_01_54",
  execution: 0,
  displayName: "lint-agent",
  buildVariant: "lint",
  projectIdentifier: "evergreen",
  status: "success",
  baseTask: null,
  __typename: "Task" as const,
};

// patch specific
const getPatchTaskWithNoBaseTask: ApolloMock<
  BaseVersionAndTaskQuery,
  BaseVersionAndTaskQueryVariables
> = {
  request: {
    query: BASE_VERSION_AND_TASK,
    variables: {
      taskId: "t1",
    },
  },
  result: {
    data: {
      task: patchTaskWithNoBaseTask,
    },
  },
};

const mainlineTaskWithBaseVersion = {
  ...taskQuery.task,
  id: "evergreen_lint_lint_agent_patch_f4fe4814088e13b8ef423a73d65a6e0a5579cf93_61a8edf132f41750ab47bc72_21_12_02_16_01_54",
  execution: 0,
  displayName: "lint-agent",
  buildVariant: "lint",
  projectIdentifier: "evergreen",
  status: "success",
  versionMetadata: {
    baseVersion: {
      ...taskQuery.task.versionMetadata,
      id: "baseVersion",
      order: 3676,
      __typename: "Version" as const,
    },
    author: "author",
    message: "message",
    order: 3676,
    project: "project",
    projectIdentifier: "projectIdentifier",
    revision: "revision",
    isPatch: false,
    id: "versionMetadataId",
    __typename: "Version" as const,
  },
  baseTask: null,
  __typename: "Task" as const,
};

// Mainline commits specific
const getMainlineTaskWithBaseVersion: ApolloMock<
  BaseVersionAndTaskQuery,
  BaseVersionAndTaskQueryVariables
> = {
  request: {
    query: BASE_VERSION_AND_TASK,
    variables: {
      taskId: "t4",
    },
  },
  result: {
    data: {
      task: mainlineTaskWithBaseVersion,
    },
  },
};

const getNullParentTask: ApolloMock<
  LastMainlineCommitQuery,
  LastMainlineCommitQueryVariables
> = {
  request: {
    query: LAST_MAINLINE_COMMIT,
    variables: {
      projectIdentifier: "evergreen",
      skipOrderNumber: 3676,
      buildVariantOptions: {
        tasks: ["^lint-agent$"],
        variants: ["^lint$"],
        statuses: ["success"],
      },
    },
  },
  error: new Error("Matching version not found in 300 most recent versions"),
};

const getParentTaskWithError: ApolloMock<
  LastMainlineCommitQuery,
  LastMainlineCommitQueryVariables
> = {
  request: {
    query: LAST_MAINLINE_COMMIT,
    variables: {
      projectIdentifier: "evergreen",
      skipOrderNumber: 3676,
      buildVariantOptions: {
        tasks: ["^lint-agent$"],
        variants: ["^lint$"],
        statuses: ["success"],
      },
    },
  },
  error: new Error("Matching version not found in 300 most recent versions"),
};
