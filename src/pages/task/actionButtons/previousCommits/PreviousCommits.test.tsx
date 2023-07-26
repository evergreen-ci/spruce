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

const goButton = "previous-commits-go-button";
const selectLabel = "Previous commits for this task";

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
        expect(screen.getByDataCy(goButton)).toHaveAttribute(
          "aria-disabled",
          "true"
        );
      });
      // Select won't be disabled because baseVersion exists
      await waitFor(() => {
        expect(screen.getByLabelText(selectLabel)).toHaveAttribute(
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
        expect(screen.getByDataCy(goButton)).toHaveAttribute(
          "aria-disabled",
          "true"
        );
      });
      // Select won't be disabled because baseVersion exists
      await waitFor(() => {
        expect(screen.getByLabelText(selectLabel)).toHaveAttribute(
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
        expect(screen.getByDataCy(goButton)).toHaveAttribute(
          "aria-disabled",
          "true"
        );
      });
      // Select won't be disabled because baseVersion exists
      await waitFor(() => {
        expect(screen.getByLabelText(selectLabel)).toHaveAttribute(
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
      expect(screen.getByDataCy(goButton)).toHaveAttribute(
        "aria-disabled",
        "true"
      );
    });
    await waitFor(() => {
      expect(screen.getByLabelText(selectLabel)).toHaveAttribute(
        "aria-disabled",
        "true"
      );
    });
  });

  it("when base task is passing, all dropdown items generate the same link.", async () => {
    renderWithRouterMatch(
      <MockedProvider mocks={[getPatchTaskWithSuccessfulBaseTask]}>
        <PreviousCommits taskId="t1" />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.getByDataCy(goButton)).toHaveAttribute(
        "href",
        baseTaskHref
      );
    });
    userEvent.click(screen.getByText("Go to base commit"));
    userEvent.click(screen.getByText("Go to last passing version"));
    await waitFor(() => {
      expect(screen.getByDataCy(goButton)).toHaveAttribute(
        "href",
        baseTaskHref
      );
    });
    userEvent.click(screen.getAllByText("Go to last passing version")[0]);
    userEvent.click(screen.getByText("Go to last executed version"));
    await waitFor(() => {
      expect(screen.getByDataCy(goButton)).toHaveAttribute(
        "href",
        baseTaskHref
      );
    });
  });

  it("when base task is failing, 'Go to base commit' and 'Go to last executed' dropdown items generate the same link and 'Go to last passing version' will be different.", async () => {
    renderWithRouterMatch(
      <MockedProvider
        mocks={[getPatchTaskWithFailingBaseTask, getLastPassingVersion]}
      >
        <PreviousCommits taskId="t1" />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.getByDataCy(goButton)).toHaveAttribute(
        "href",
        baseTaskHref
      );
    });
    userEvent.click(screen.getByText("Go to base commit"));
    userEvent.click(screen.getByText("Go to last executed version"));
    await waitFor(() => {
      expect(screen.getByDataCy(goButton)).toHaveAttribute(
        "href",
        baseTaskHref
      );
    });
    userEvent.click(screen.getAllByText("Go to last executed version")[0]);
    userEvent.click(screen.getByText("Go to last passing version"));
    await waitFor(() => {
      expect(screen.getByDataCy(goButton)).toHaveAttribute(
        "href",
        "/task/last_passing_task"
      );
    });
  });

  it("when base task is not in a finished state, the last executed & passing task is not the same as the base commit", async () => {
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
      expect(screen.getByDataCy(goButton)).toHaveAttribute(
        "href",
        baseTaskHref
      );
    });
    userEvent.click(screen.getByText("Go to base commit"));
    userEvent.click(screen.getByText("Go to last executed version"));
    await waitFor(() => {
      expect(screen.getByDataCy(goButton)).toHaveAttribute(
        "href",
        "/task/last_executed_task"
      );
    });
    userEvent.click(screen.getAllByText("Go to last executed version")[0]);
    userEvent.click(screen.getByText("Go to last passing version"));
    await waitFor(() => {
      expect(screen.getByDataCy(goButton)).toHaveAttribute(
        "href",
        "/task/last_passing_task"
      );
    });
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
        __typename: "Task",
        baseTask: {
          __typename: "Task",
          execution: 0,
          id: baseTaskId,
          status: "success",
        },
        buildVariant: "lint",
        displayName: "lint-agent",
        execution: 0,
        id: "evergreen_lint_lint_agent_patch_f4fe4814088e13b8ef423a73d65a6e0a5579cf93_61a8edf132f41750ab47bc72_21_12_02_16_01_54",
        versionMetadata: {
          __typename: "Version",
          baseVersion: {
            __typename: "Version",
            id: "baseVersion",
            order: 3676,
            projectIdentifier: "evergreen",
          },
          id: "versionMetadataId",
          isPatch: true,
        },
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
        __typename: "Task",
        baseTask: {
          __typename: "Task",
          execution: 0,
          id: baseTaskId,
          status: "started",
        },
        buildVariant: "lint",
        displayName: "lint-agent",
        execution: 0,
        id: "evergreen_lint_lint_agent_patch_f4fe4814088e13b8ef423a73d65a6e0a5579cf93_61a8edf132f41750ab47bc72_21_12_02_16_01_54",
        versionMetadata: {
          __typename: "Version",
          baseVersion: {
            __typename: "Version",
            id: "baseVersion",
            order: 3676,
            projectIdentifier: "evergreen",
          },
          id: "versionMetadataId",
          isPatch: true,
        },
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
        __typename: "Task",
        baseTask: {
          __typename: "Task",
          execution: 0,
          id: baseTaskId,
          status: "failed",
        },
        buildVariant: "lint",
        displayName: "lint-agent",
        execution: 0,
        id: "evergreen_lint_lint_agent_patch_f4fe4814088e13b8ef423a73d65a6e0a5579cf93_61a8edf132f41750ab47bc72_21_12_02_16_01_54",
        versionMetadata: {
          __typename: "Version",
          baseVersion: {
            __typename: "Version",
            id: "baseVersion",
            order: 3676,
            projectIdentifier: "evergreen",
          },
          id: "versionMetadataId",
          isPatch: true,
        },
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
        __typename: "Task",
        baseTask: null,
        buildVariant: "lint",
        displayName: "lint-agent",
        execution: 0,
        id: "evergreen_lint_lint_agent_patch_f4fe4814088e13b8ef423a73d65a6e0a5579cf93_61a8edf132f41750ab47bc72_21_12_02_16_01_54",
        versionMetadata: {
          __typename: "Version",
          baseVersion: null,
          id: "versionMetadataId",
          isPatch: true,
        },
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
      buildVariantOptions: {
        statuses: ["success"],
        tasks: ["^lint-agent$"],
        variants: ["^lint$"],
      },
      projectIdentifier: "evergreen",
      skipOrderNumber: 3676,
    },
  },
  result: {
    data: {
      mainlineCommits: {
        __typename: "MainlineCommits",
        versions: [
          {
            __typename: "MainlineCommitVersion",
            version: {
              __typename: "Version",
              buildVariants: [
                {
                  __typename: "GroupedBuildVariant",
                  tasks: [
                    {
                      __typename: "Task",
                      execution: 0,
                      id: "last_passing_task",
                      status: "success",
                    },
                  ],
                },
              ],
              id: "evergreen_44110b57c6977bf3557009193628c9389772163f",
            },
          },
        ],
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
      buildVariantOptions: {
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
        tasks: ["^lint-agent$"],
        variants: ["^lint$"],
      },
      projectIdentifier: "evergreen",
      skipOrderNumber: 3676,
    },
  },
  result: {
    data: {
      mainlineCommits: {
        __typename: "MainlineCommits",
        versions: [
          {
            __typename: "MainlineCommitVersion",
            version: {
              __typename: "Version",
              buildVariants: [
                {
                  __typename: "GroupedBuildVariant",
                  tasks: [
                    {
                      __typename: "Task",
                      execution: 0,
                      id: "last_executed_task",
                      status: "failed",
                    },
                  ],
                },
              ],
              id: "evergreen_44110b57c6977bf3557009193628c9389772163f",
            },
          },
        ],
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
        __typename: "Task",
        baseTask: null,
        buildVariant: "lint",
        displayName: "lint-agent",
        execution: 0,
        id: "evergreen_lint_lint_agent_patch_f4fe4814088e13b8ef423a73d65a6e0a5579cf93_61a8edf132f41750ab47bc72_21_12_02_16_01_54",
        versionMetadata: {
          __typename: "Version",
          baseVersion: {
            __typename: "Version",
            id: "baseVersion",
            order: 3676,
            projectIdentifier: "evergreen",
          },
          id: "versionMetadataId",
          isPatch: true,
        },
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
        __typename: "Task",
        baseTask: null,
        buildVariant: "lint",
        displayName: "lint-agent",
        execution: 0,
        id: "evergreen_lint_lint_agent_patch_f4fe4814088e13b8ef423a73d65a6e0a5579cf93_61a8edf132f41750ab47bc72_21_12_02_16_01_54",
        versionMetadata: {
          __typename: "Version",
          baseVersion: {
            __typename: "Version",
            id: "baseVersion",
            order: 3676,
            projectIdentifier: "evergreen",
          },
          id: "versionMetadataId",
          isPatch: false,
        },
      },
    },
  },
};

const getNullParentTask: ApolloMock<
  LastMainlineCommitQuery,
  LastMainlineCommitQueryVariables
> = {
  error: new Error("Matching version not found in 300 most recent versions"),
  request: {
    query: GET_LAST_MAINLINE_COMMIT,
    variables: {
      buildVariantOptions: {
        statuses: ["success"],
        tasks: ["^lint-agent$"],
        variants: ["^lint$"],
      },
      projectIdentifier: "evergreen",
      skipOrderNumber: 3676,
    },
  },
};

const getParentTaskWithError: ApolloMock<
  LastMainlineCommitQuery,
  LastMainlineCommitQueryVariables
> = {
  error: new Error("Matching version not found in 300 most recent versions"),
  request: {
    query: GET_LAST_MAINLINE_COMMIT,
    variables: {
      buildVariantOptions: {
        statuses: ["success"],
        tasks: ["^lint-agent$"],
        variants: ["^lint$"],
      },
      projectIdentifier: "evergreen",
      skipOrderNumber: 3676,
    },
  },
};
