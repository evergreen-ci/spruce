import { MockedProvider } from "@apollo/client/testing";
import userEvent from "@testing-library/user-event";
import {
  GET_BASE_VERSION_AND_TASK,
  GET_LAST_MAINLINE_COMMIT,
} from "gql/queries";
import { renderWithRouterMatch, waitFor } from "test_utils";
import { PreviousCommits } from "./PreviousCommits";

describe("previous commits", () => {
  // Patch and mainline commit behavior only have a significant difference when it comes to determining
  // the base or parent task. Patch gets the base task directly from GET_BASE_VERSION_AND_TASK, while
  // mainline commits needs to run another query GET_LAST_MAINLINE_COMMIT to get parent task.
  describe("patch specific", () => {
    it("the GO button is disabled when there is no base task", async () => {
      const { getByText } = renderWithRouterMatch(
        <MockedProvider mocks={[getPatchTaskWithNoBaseTask]}>
          <PreviousCommits taskId="t1" />
        </MockedProvider>
      );
      await waitFor(() => {
        expect(getByText("Go").closest("a")).toHaveAttribute(
          "aria-disabled",
          "true"
        );
      });
      // Select won't be disabled because baseVersion exists
      await waitFor(() => {
        expect(
          getByText("Go to base commit").closest("button")
        ).toHaveAttribute("aria-disabled", "false");
      });
    });
  });

  describe("mainline commits specific", () => {
    it("the GO button is disabled when getParentTask returns null", async () => {
      const { getByText } = renderWithRouterMatch(
        <MockedProvider
          mocks={[getMainlineTaskWithBaseVersion, getNullParentTask]}
        >
          <PreviousCommits taskId="t4" />
        </MockedProvider>
      );
      await waitFor(() => {
        expect(getByText("Go").closest("a")).toHaveAttribute(
          "aria-disabled",
          "true"
        );
      });
      // Select won't be disabled because baseVersion exists (the baseVersion of a mainline commit is itself).
      await waitFor(() => {
        expect(
          getByText("Go to parent commit").closest("button")
        ).toHaveAttribute("aria-disabled", "false");
      });
    });

    it("the GO button is disabled when getParentTask returns an error", async () => {
      const { getByText } = renderWithRouterMatch(
        <MockedProvider
          mocks={[getMainlineTaskWithBaseVersion, getParentTaskWithError]}
        >
          <PreviousCommits taskId="t4" />
        </MockedProvider>
      );
      await waitFor(() => {
        expect(getByText("Go").closest("a")).toHaveAttribute(
          "aria-disabled",
          "true"
        );
      });
      // Select won't be disabled because baseVersion exists
      await waitFor(() => {
        expect(
          getByText("Go to parent commit").closest("button")
        ).toHaveAttribute("aria-disabled", "false");
      });
    });
  });

  it("the select & GO button are disabled when no base version exists", async () => {
    const { getByText } = renderWithRouterMatch(
      <MockedProvider mocks={[getPatchTaskWithNoBaseVersion]}>
        <PreviousCommits taskId="t3" />
      </MockedProvider>
    );
    await waitFor(() => {
      expect(getByText("Go").closest("a")).toHaveAttribute(
        "aria-disabled",
        "true"
      );
    });
    await waitFor(() => {
      expect(getByText("Go to base commit").closest("button")).toHaveAttribute(
        "aria-disabled",
        "true"
      );
    });
  });

  it("when base task is passing, all dropdown items generate the same link.", async () => {
    const { getAllByText, getByText } = renderWithRouterMatch(
      <MockedProvider mocks={[getPatchTaskWithSuccessfulBaseTask]}>
        <PreviousCommits taskId="t1" />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(getByText("Go").closest("a")).toHaveAttribute(
        "href",
        baseTaskHref
      );
    });
    userEvent.click(getByText("Go to base commit"));
    userEvent.click(getByText("Go to last passing version"));
    await waitFor(() => {
      expect(getByText("Go").closest("a")).toHaveAttribute(
        "href",
        baseTaskHref
      );
    });
    userEvent.click(getAllByText("Go to last passing version")[0]);
    userEvent.click(getByText("Go to last executed version"));
    await waitFor(() => {
      expect(getByText("Go").closest("a")).toHaveAttribute(
        "href",
        baseTaskHref
      );
    });
  });

  it("when base task is failing, 'Go to base commit' and 'Go to last executed' dropdown items generate the same link and 'Go to last passing version' will be different.", async () => {
    const { getAllByText, getByText } = renderWithRouterMatch(
      <MockedProvider
        mocks={[getPatchTaskWithFailingBaseTask, getLastPassingVersion]}
      >
        <PreviousCommits taskId="t1" />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(getByText("Go")).toBeInTheDocument();
      expect(getByText("Go").closest("a")).toHaveAttribute(
        "href",
        baseTaskHref
      );
    });
    userEvent.click(getByText("Go to base commit"));
    userEvent.click(getByText("Go to last executed version"));
    await waitFor(() => {
      expect(getByText("Go").closest("a")).toHaveAttribute(
        "href",
        baseTaskHref
      );
    });
    userEvent.click(getAllByText("Go to last executed version")[0]);
    userEvent.click(getByText("Go to last passing version"));
    await waitFor(() => {
      expect(getByText("Go").closest("a")).toHaveAttribute(
        "href",
        "/task/last_passing_task"
      );
    });
  });

  it("when base task is not in a finished state, the last executed & passing task is not the same as the base commit", async () => {
    const { getAllByText, getByText } = renderWithRouterMatch(
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
      expect(getByText("Go").closest("a")).toHaveAttribute(
        "href",
        baseTaskHref
      );
    });
    userEvent.click(getByText("Go to base commit"));
    userEvent.click(getByText("Go to last executed version"));
    await waitFor(() => {
      expect(getByText("Go").closest("a")).toHaveAttribute(
        "href",
        "/task/last_executed_task"
      );
    });
    userEvent.click(getAllByText("Go to last executed version")[0]);
    userEvent.click(getByText("Go to last passing version"));
    await waitFor(() => {
      expect(getByText("Go").closest("a")).toHaveAttribute(
        "href",
        "/task/last_passing_task"
      );
    });
  });
});

const baseTaskId =
  "evergreen_lint_lint_agent_f4fe4814088e13b8ef423a73d65a6e0a5579cf93_21_11_29_17_55_27";
const baseTaskHref = `/task/${baseTaskId}`;

const getPatchTaskWithSuccessfulBaseTask = {
  request: {
    query: GET_BASE_VERSION_AND_TASK,
    variables: {
      taskId: "t1",
    },
  },
  result: {
    data: {
      task: {
        id:
          "evergreen_lint_lint_agent_patch_f4fe4814088e13b8ef423a73d65a6e0a5579cf93_61a8edf132f41750ab47bc72_21_12_02_16_01_54",
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

const getPatchTaskWithRunningBaseTask = {
  request: {
    query: GET_BASE_VERSION_AND_TASK,
    variables: {
      taskId: "t3",
    },
  },
  result: {
    data: {
      task: {
        id:
          "evergreen_lint_lint_agent_patch_f4fe4814088e13b8ef423a73d65a6e0a5579cf93_61a8edf132f41750ab47bc72_21_12_02_16_01_54",
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

const getPatchTaskWithFailingBaseTask = {
  request: {
    query: GET_BASE_VERSION_AND_TASK,
    variables: {
      taskId: "t1",
    },
  },
  result: {
    data: {
      task: {
        id:
          "evergreen_lint_lint_agent_patch_f4fe4814088e13b8ef423a73d65a6e0a5579cf93_61a8edf132f41750ab47bc72_21_12_02_16_01_54",
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

const getPatchTaskWithNoBaseVersion = {
  request: {
    query: GET_BASE_VERSION_AND_TASK,
    variables: {
      taskId: "t3",
    },
  },
  result: {
    data: {
      task: {
        id:
          "evergreen_lint_lint_agent_patch_f4fe4814088e13b8ef423a73d65a6e0a5579cf93_61a8edf132f41750ab47bc72_21_12_02_16_01_54",
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

const getLastPassingVersion = {
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

const getLastExecutedVersion = {
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
const getPatchTaskWithNoBaseTask = {
  request: {
    query: GET_BASE_VERSION_AND_TASK,
    variables: {
      taskId: "t1",
    },
  },
  result: {
    data: {
      task: {
        id:
          "evergreen_lint_lint_agent_patch_f4fe4814088e13b8ef423a73d65a6e0a5579cf93_61a8edf132f41750ab47bc72_21_12_02_16_01_54",
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
const getMainlineTaskWithBaseVersion = {
  request: {
    query: GET_BASE_VERSION_AND_TASK,
    variables: {
      taskId: "t4",
    },
  },
  result: {
    data: {
      task: {
        id:
          "evergreen_lint_lint_agent_patch_f4fe4814088e13b8ef423a73d65a6e0a5579cf93_61a8edf132f41750ab47bc72_21_12_02_16_01_54",
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

const getNullParentTask = {
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

const getParentTaskWithError = {
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
