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
import { PreviousCommits } from ".";

describe("previous commits", () => {
  // Patch and mainline commit behavior only have a significant difference when it comes to determining
  // the base or previous task. Patch gets the base task directly from BASE_VERSION_AND_TASK, while
  // mainline commits needs to run another query LAST_MAINLINE_COMMIT to get previous task.
  describe("patch specific", () => {
    it("the button is disabled when there is no base task", async () => {
      const { Component } = RenderFakeToastContext(
        <MockedProvider mocks={[getPatchTaskWithNoBaseTask]}>
          <PreviousCommits taskId="t1" />
        </MockedProvider>
      );
      renderWithRouterMatch(<Component />);
      await waitFor(() => {
        expect(
          screen.getByRole("button", { name: "Previous commits" })
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
          <PreviousCommits taskId="t4" />
        </MockedProvider>
      );
      renderWithRouterMatch(<Component />);

      await waitFor(() => {
        expect(
          screen.getByRole("button", { name: "Previous commits" })
        ).toHaveAttribute("aria-disabled", "true");
      });
    });

    it("the button is disabled when getParentTask returns an error", async () => {
      const { Component } = RenderFakeToastContext(
        <MockedProvider
          mocks={[getMainlineTaskWithBaseVersion, getParentTaskWithError]}
        >
          <PreviousCommits taskId="t4" />
        </MockedProvider>
      );
      renderWithRouterMatch(<Component />);

      await waitFor(() => {
        expect(
          screen.getByRole("button", { name: "Previous commits" })
        ).toHaveAttribute("aria-disabled", "true");
      });
    });
  });

  it("the button is disabled when no base version exists", async () => {
    const { Component } = RenderFakeToastContext(
      <MockedProvider mocks={[getPatchTaskWithNoBaseVersion]}>
        <PreviousCommits taskId="t3" />
      </MockedProvider>
    );
    renderWithRouterMatch(<Component />);

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: "Previous commits" })
      ).toHaveAttribute("aria-disabled", "true");
    });
  });

  it("when base task is passing, all dropdown items generate the same link", async () => {
    const user = userEvent.setup();
    const { Component } = RenderFakeToastContext(
      <MockedProvider
        mocks={[
          getPatchTaskWithSuccessfulBaseTask,
          getLastPassingVersion,
          getLastExecutedVersion,
        ]}
      >
        <PreviousCommits taskId="t1" />
      </MockedProvider>
    );
    renderWithRouterMatch(<Component />);

    await screen.findByRole("button", { name: "Previous commits" });
    expect(
      screen.getByRole("button", { name: "Previous commits" })
    ).toHaveAttribute("aria-disabled", "false");
    await user.click(screen.getByRole("button", { name: "Previous commits" }));
    await waitFor(() => {
      expect(screen.getByRole("menu")).toBeVisible();
    });

    expect(
      screen.getByRole("menuitem", { name: "Base commit" })
    ).toHaveAttribute("href", baseTaskHref);
    expect(
      screen.getByRole("menuitem", { name: "Last passing version" })
    ).toHaveAttribute("href", baseTaskHref);
    expect(
      screen.getByRole("menuitem", { name: "Last executed version" })
    ).toHaveAttribute("href", baseTaskHref);
  });

  it("when base task is failing, 'Go to base commit' and 'Go to last executed' dropdown items generate the same link and 'Go to last passing version' will be different.", async () => {
    const user = userEvent.setup();
    const { Component } = RenderFakeToastContext(
      <MockedProvider
        mocks={[getPatchTaskWithFailingBaseTask, getLastPassingVersion]}
      >
        <PreviousCommits taskId="t1" />
      </MockedProvider>
    );
    renderWithRouterMatch(<Component />);

    await screen.findByRole("button", { name: "Previous commits" });
    expect(
      screen.getByRole("button", { name: "Previous commits" })
    ).toHaveAttribute("aria-disabled", "false");
    await user.click(screen.getByRole("button", { name: "Previous commits" }));
    await waitFor(() => {
      expect(screen.getByRole("menu")).toBeVisible();
    });

    expect(
      screen.getByRole("menuitem", { name: "Base commit" })
    ).toHaveAttribute("href", baseTaskHref);
    expect(
      screen.getByRole("menuitem", { name: "Last passing version" })
    ).toHaveAttribute("href", "/task/last_passing_task");
    expect(
      screen.getByRole("menuitem", { name: "Last executed version" })
    ).toHaveAttribute("href", baseTaskHref);
  });

  it("when base task is not in a finished state, the last executed & passing task is not the same as the base commit", async () => {
    const user = userEvent.setup();
    const { Component } = RenderFakeToastContext(
      <MockedProvider
        mocks={[
          getPatchTaskWithRunningBaseTask,
          getLastPassingVersion,
          getLastExecutedVersion,
        ]}
      >
        <PreviousCommits taskId="t3" />
      </MockedProvider>
    );
    renderWithRouterMatch(<Component />);

    await screen.findByRole("button", { name: "Previous commits" });
    expect(
      screen.getByRole("button", { name: "Previous commits" })
    ).toHaveAttribute("aria-disabled", "false");
    await user.click(screen.getByRole("button", { name: "Previous commits" }));
    await waitFor(() => {
      expect(screen.getByRole("menu")).toBeVisible();
    });

    expect(
      screen.getByRole("menuitem", { name: "Base commit" })
    ).toHaveAttribute("href", baseTaskHref);
    expect(
      screen.getByRole("menuitem", { name: "Last passing version" })
    ).toHaveAttribute("href", "/task/last_passing_task");
    expect(
      screen.getByRole("menuitem", { name: "Last executed version" })
    ).toHaveAttribute("href", "/task/last_executed_task");
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
        versionMetadata: {
          baseVersion: {
            id: "baseVersion",
            order: 3676,
            projectIdentifier: "evergreen",
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
        versionMetadata: {
          baseVersion: {
            id: "baseVersion",
            order: 3676,
            projectIdentifier: "evergreen",
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
        versionMetadata: {
          baseVersion: {
            id: "baseVersion",
            order: 3676,
            projectIdentifier: "evergreen",
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
        versionMetadata: {
          baseVersion: {
            id: "baseVersion",
            order: 3676,
            projectIdentifier: "evergreen",
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
        versionMetadata: {
          baseVersion: {
            id: "baseVersion",
            order: 3676,
            projectIdentifier: "evergreen",
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
