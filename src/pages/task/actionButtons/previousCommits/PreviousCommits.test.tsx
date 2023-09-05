import { MockedProvider } from "@apollo/client/testing";
import {
  BaseVersionAndTaskQuery,
  BaseVersionAndTaskQueryVariables,
  LastMainlineCommitQuery,
  LastMainlineCommitQueryVariables,
} from "gql/generated/types";
import {
  GET_BASE_VERSION_AND_TASK,
  GET_LAST_MAINLINE_COMMIT,
} from "gql/queries";
import { renderWithRouterMatch, screen, userEvent, waitFor } from "test_utils";
import { ApolloMock } from "types/gql";
import { PreviousCommits } from "./PreviousCommits";

const goButton = { name: "Go" };
const select = { name: "Previous commits for this task" };

describe("previous commits", () => {
  // Patch and mainline commit behavior only have a significant difference when it comes to determining
  // the base or previous task. Patch gets the base task directly from GET_BASE_VERSION_AND_TASK, while
  // mainline commits needs to run another query GET_LAST_MAINLINE_COMMIT to get previous task.
  describe("patch specific", () => {
    it("the GO button is disabled when there is no base task", async () => {
      renderWithRouterMatch(
        <MockedProvider mocks={[getPatchTaskWithNoBaseTask]}>
          <PreviousCommits taskId="t1" />
        </MockedProvider>
      );
      await waitFor(() => {
        expect(screen.getByRole("link", goButton)).toHaveAttribute(
          "aria-disabled",
          "true"
        );
      });
      // Select won't be disabled because baseVersion exists
      await waitFor(() => {
        expect(screen.getByRole("button", select)).toHaveAttribute(
          "aria-disabled",
          "false"
        );
      });
      // Should say "base" for patches
      expect(screen.getByText("Go to base commit")).toBeInTheDocument();
    });
  });

  describe("mainline commits specific", () => {
    it("the GO button is disabled when getParentTask returns null", async () => {
      renderWithRouterMatch(
        <MockedProvider
          mocks={[getMainlineTaskWithBaseVersion, getNullParentTask]}
        >
          <PreviousCommits taskId="t4" />
        </MockedProvider>
      );
      await waitFor(() => {
        expect(screen.getByRole("link", goButton)).toHaveAttribute(
          "aria-disabled",
          "true"
        );
      });
      // Select won't be disabled because baseVersion exists
      await waitFor(() => {
        expect(screen.getByRole("button", select)).toHaveAttribute(
          "aria-disabled",
          "false"
        );
      });
      // Should say "previous" for versions
      expect(screen.getByText("Go to previous commit")).toBeInTheDocument();
    });

    it("the GO button is disabled when getParentTask returns an error", async () => {
      renderWithRouterMatch(
        <MockedProvider
          mocks={[getMainlineTaskWithBaseVersion, getParentTaskWithError]}
        >
          <PreviousCommits taskId="t4" />
        </MockedProvider>
      );
      await waitFor(() => {
        expect(screen.getByRole("link", goButton)).toHaveAttribute(
          "aria-disabled",
          "true"
        );
      });
      // Select won't be disabled because baseVersion exists
      await waitFor(() => {
        expect(screen.getByRole("button", select)).toHaveAttribute(
          "aria-disabled",
          "false"
        );
      });
      // Should say "previous" for versions
      expect(screen.getByText("Go to previous commit")).toBeInTheDocument();
    });
  });

  it("the select & GO button are disabled when no base version exists", async () => {
    renderWithRouterMatch(
      <MockedProvider mocks={[getPatchTaskWithNoBaseVersion]}>
        <PreviousCommits taskId="t3" />
      </MockedProvider>
    );
    await waitFor(() => {
      expect(screen.getByRole("link", goButton)).toHaveAttribute(
        "aria-disabled",
        "true"
      );
    });
    await waitFor(() => {
      expect(screen.getByRole("button", select)).toHaveAttribute(
        "aria-disabled",
        "true"
      );
    });
  });

  it("when base task is passing, all dropdown items generate the same link.", async () => {
    const user = userEvent.setup();
    renderWithRouterMatch(
      <MockedProvider mocks={[getPatchTaskWithSuccessfulBaseTask]}>
        <PreviousCommits taskId="t1" />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.getByRole("link", goButton)).toHaveAttribute(
        "href",
        baseTaskHref
      );
    });
    await user.click(screen.getByRole("button", select));
    await user.click(
      screen.getByRole("option", { name: "Go to last passing version" })
    );
    expect(screen.getByRole("link", goButton)).toHaveAttribute(
      "href",
      baseTaskHref
    );
    await user.click(screen.getByRole("button", select));
    await user.click(
      screen.getByRole("option", { name: "Go to last executed version" })
    );
    expect(screen.getByRole("link", goButton)).toHaveAttribute(
      "href",
      baseTaskHref
    );
  });

  it("when base task is failing, 'Go to base commit' and 'Go to last executed' dropdown items generate the same link and 'Go to last passing version' will be different.", async () => {
    const user = userEvent.setup();
    renderWithRouterMatch(
      <MockedProvider
        mocks={[getPatchTaskWithFailingBaseTask, getLastPassingVersion]}
      >
        <PreviousCommits taskId="t1" />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.getByRole("link", goButton)).toHaveAttribute(
        "href",
        baseTaskHref
      );
    });
    await user.click(screen.getByRole("button", select));
    await user.click(
      screen.getByRole("option", { name: "Go to last executed version" })
    );
    expect(screen.getByRole("link", goButton)).toHaveAttribute(
      "href",
      baseTaskHref
    );
    await user.click(screen.getByRole("button", select));
    await user.click(
      screen.getByRole("option", { name: "Go to last passing version" })
    );
    await waitFor(() => {
      expect(screen.getByRole("link", goButton)).toHaveAttribute(
        "href",
        "/task/last_passing_task"
      );
    });
  });

  it("when base task is not in a finished state, the last executed & passing task is not the same as the base commit", async () => {
    const user = userEvent.setup();
    renderWithRouterMatch(
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

    await waitFor(() => {
      expect(screen.getByRole("link", goButton)).toHaveAttribute(
        "href",
        baseTaskHref
      );
    });
    await user.click(screen.getByRole("button", select));
    await user.click(
      screen.getByRole("option", { name: "Go to last executed version" })
    );
    expect(screen.getByRole("link", goButton)).toHaveAttribute(
      "href",
      "/task/last_executed_task"
    );
    await user.click(screen.getByRole("button", select));
    await user.click(
      screen.getByRole("option", { name: "Go to last passing version" })
    );
    expect(screen.getByRole("link", goButton)).toHaveAttribute(
      "href",
      "/task/last_passing_task"
    );
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
    query: GET_BASE_VERSION_AND_TASK,
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
    query: GET_BASE_VERSION_AND_TASK,
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
    query: GET_BASE_VERSION_AND_TASK,
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
    query: GET_BASE_VERSION_AND_TASK,
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
    query: GET_LAST_MAINLINE_COMMIT,
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
    query: GET_LAST_MAINLINE_COMMIT,
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
    query: GET_BASE_VERSION_AND_TASK,
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
    query: GET_BASE_VERSION_AND_TASK,
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
    query: GET_LAST_MAINLINE_COMMIT,
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
    query: GET_LAST_MAINLINE_COMMIT,
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
