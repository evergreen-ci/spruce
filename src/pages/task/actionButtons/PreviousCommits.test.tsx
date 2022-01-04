import { MockedProvider } from "@apollo/client/testing";
import userEvent from "@testing-library/user-event";
import {
  GET_BASE_VERSION_AND_TASK,
  GET_LAST_MAINLINE_COMMIT,
} from "gql/queries";
import { renderWithRouterMatch, waitFor } from "test_utils";
import { PreviousCommits } from "./PreviousCommits";

describe("previous Commits", () => {
  it("when base task is passing, all dropdown items generate the same link.", async () => {
    const { queryAllByText, queryByText } = renderWithRouterMatch(() => (
      <MockedProvider mocks={[getTaskWithSuccessfulBase]}>
        <PreviousCommits taskId="t1" />
      </MockedProvider>
    ));

    await waitFor(() => {
      expect(queryByText("Go").closest("a")).toHaveAttribute(
        "href",
        baseTaskHref
      );
    });
    userEvent.click(queryByText("Go to base commit"));
    userEvent.click(queryByText("Go to last passing version"));
    await waitFor(() => {
      expect(queryByText("Go").closest("a")).toHaveAttribute(
        "href",
        baseTaskHref
      );
    });
    userEvent.click(queryAllByText("Go to last passing version")[0]);
    userEvent.click(queryByText("Go to last executed version"));
    await waitFor(() => {
      expect(queryByText("Go").closest("a")).toHaveAttribute(
        "href",
        baseTaskHref
      );
    });
  });

  it("when base task is failing, 'Go to base commit' and 'Go to last executed' dropdown items generate the same link and 'Go to last passing version' will be different.", async () => {
    const { queryAllByText, queryByText } = renderWithRouterMatch(() => (
      <MockedProvider mocks={[getTaskWithFailingBase, getLastPassingVersion]}>
        <PreviousCommits taskId="t1" />
      </MockedProvider>
    ));

    await waitFor(() => {
      expect(queryByText("Go").closest("a")).toHaveAttribute(
        "href",
        baseTaskHref
      );
    });
    userEvent.click(queryByText("Go to base commit"));
    userEvent.click(queryByText("Go to last executed version"));
    await waitFor(() => {
      expect(queryByText("Go").closest("a")).toHaveAttribute(
        "href",
        baseTaskHref
      );
    });
    userEvent.click(queryAllByText("Go to last executed version")[0]);
    userEvent.click(queryByText("Go to last passing version"));
    await waitFor(() => {
      expect(queryByText("Go").closest("a")).toHaveAttribute(
        "href",
        "/task/last_passing_task"
      );
    });
  });

  it("when base task is not in a finished state, the last executed & passing task is not the same as the base commit", async () => {
    const { queryAllByText, queryByText } = renderWithRouterMatch(() => (
      <MockedProvider
        mocks={[
          getTaskWithRunningBase,
          getLastPassingVersion,
          getLastExecutedVersion,
        ]}
      >
        <PreviousCommits taskId="t3" />
      </MockedProvider>
    ));

    await waitFor(() => {
      expect(queryByText("Go").closest("a")).toHaveAttribute(
        "href",
        baseTaskHref
      );
    });
    userEvent.click(queryByText("Go to base commit"));
    userEvent.click(queryByText("Go to last executed version"));
    await waitFor(() => {
      expect(queryByText("Go").closest("a")).toHaveAttribute(
        "href",
        "/task/last_executed_task"
      );
    });
    userEvent.click(queryAllByText("Go to last executed version")[0]);
    userEvent.click(queryByText("Go to last passing version"));
    await waitFor(() => {
      expect(queryByText("Go").closest("a")).toHaveAttribute(
        "href",
        "/task/last_passing_task"
      );
    });
  });

  it("the select is disabled when no base version exists", async () => {
    const { queryByText } = renderWithRouterMatch(() => (
      <MockedProvider mocks={[getTaskWithNoBaseVersion]}>
        <PreviousCommits taskId="t3" />
      </MockedProvider>
    ));
    await waitFor(() => {
      expect(queryByText("Go").closest("a")).toHaveAttribute(
        "aria-disabled",
        "true"
      );
    });
    await waitFor(() => {
      expect(
        queryByText("Go to base commit").closest("button")
      ).toHaveAttribute("aria-disabled", "true");
    });
  });

  const baseTaskId =
    "evergreen_lint_lint_agent_f4fe4814088e13b8ef423a73d65a6e0a5579cf93_21_11_29_17_55_27";
  const baseTaskHref = `/task/${baseTaskId}`;
  const getTaskWithSuccessfulBase = {
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

  const getTaskWithRunningBase = {
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

  const getTaskWithFailingBase = {
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

  const getLastPassingVersion = {
    request: {
      query: GET_LAST_MAINLINE_COMMIT,
      variables: {
        projectIdentifier: "evergreen",
        skipOrderNumber: 3677,
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

  const getTaskWithNoBaseVersion = {
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
            isPatch: true,
            __typename: "Version",
          },
          baseTask: null,
          __typename: "Task",
        },
      },
    },
  };

  const getLastExecutedVersion = {
    request: {
      query: GET_LAST_MAINLINE_COMMIT,
      variables: {
        projectIdentifier: "evergreen",
        skipOrderNumber: 3677,
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
});
