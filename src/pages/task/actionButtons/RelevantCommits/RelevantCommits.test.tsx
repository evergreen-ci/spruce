import { MockedProvider } from "@apollo/client/testing";
import { RenderFakeToastContext } from "context/toast/__mocks__";
import {
  BaseVersionAndTaskQuery,
  BaseVersionAndTaskQueryVariables,
  LastMainlineCommitQuery,
  LastMainlineCommitQueryVariables,
} from "gql/generated/types";
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
          <RelevantCommits taskId="t1" />
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
          <RelevantCommits taskId="t4" />
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
          <RelevantCommits taskId="t4" />
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
        <RelevantCommits taskId="t3" />
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
        <RelevantCommits taskId="t1" />
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

  it("when base task is failing, 'Go to base commit' and 'Go to last executed' dropdown items generate the same link and 'Go to last passing version' will be different and 'Go to breaking commit' will be disabled", async () => {
    const user = userEvent.setup();
    const { Component } = RenderFakeToastContext(
      <MockedProvider
        mocks={[getPatchTaskWithFailingBaseTask, getLastPassingVersion]}
      >
        <RelevantCommits taskId="t1" />
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
    ).toHaveAttribute("aria-disabled", "true");
  });

  it("when base task is not in a finished state, the last executed, passing task, and breaking task is not the same as the base commit", async () => {
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
        <RelevantCommits taskId="t3" />
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
    ).toHaveAttribute("href", "/task/breaking_commit");
  });
});

const baseTaskId =
  "evergreen_lint_lint_agent_f4fe4814088e13b8ef423a73d65a6e0a5579cf93_21_11_29_17_55_27";
const baseTaskHref = `/task/${baseTaskId}`;

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
      task: {
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
            __typename: "Version",
          },
          isPatch: true,
          id: "versionMetadataId",
          __typename: "Version",
        },
        baseTask: {
          id: baseTaskId,
          execution: 0,
          status: "success",
          __typename: "Task",
        },
        __typename: "Task",
      },
    },
  },
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
      task: {
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
            __typename: "Version",
          },
          isPatch: true,
          id: "versionMetadataId",
          __typename: "Version",
        },
        baseTask: {
          id: baseTaskId,
          execution: 0,
          status: "started",
          __typename: "Task",
        },
        __typename: "Task",
      },
    },
  },
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
      task: {
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
            __typename: "Version",
          },
          isPatch: true,
          id: "versionMetadataId",
          __typename: "Version",
        },
        baseTask: {
          id: baseTaskId,
          execution: 0,
          status: "failed",
          __typename: "Task",
        },
        __typename: "Task",
      },
    },
  },
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
      task: {
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
          __typename: "Version",
        },
        baseTask: null,
        __typename: "Task",
      },
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
      skipOrderNumber: 3678,
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
                      order: 3677,
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
                      order: 3676,
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
      task: {
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
            __typename: "Version",
          },
          isPatch: true,
          id: "versionMetadataId",
          __typename: "Version",
        },
        baseTask: null,
        __typename: "Task",
      },
    },
  },
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
      task: {
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
            __typename: "Version",
          },
          isPatch: false,
          id: "versionMetadataId",
          __typename: "Version",
        },
        baseTask: null,
        __typename: "Task",
      },
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
