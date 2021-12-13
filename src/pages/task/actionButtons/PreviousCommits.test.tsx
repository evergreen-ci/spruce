import { MockedProvider } from "@apollo/client/testing";
import userEvent from "@testing-library/user-event";
import {
  GET_BASE_VERSION_AND_TASK,
  GET_LAST_MAINLINE_COMMIT,
} from "gql/queries";
import { renderWithRouterMatch, waitFor } from "test_utils/test-utils";
import { PreviousCommits } from "./PreviousCommits";

describe("Previous Commits", () => {
  test("When base task is passing, all dropdown items generate the same link.", async () => {
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

  test("When base task is failing, 'Go to base commit' and 'Go to last executed' dropdown items generate the same link.", async () => {
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
        "/task/evergreen_lint_generate_lint_44110b57c6977bf3557009193628c9389772163f_21_11_29_14_13_34"
      );
    });
  });

  test("The Go button is disabled when a previous commit does not exist", async () => {
    const { queryByText, queryAllByText } = renderWithRouterMatch(() => (
      <MockedProvider
        mocks={[
          getTaskWithNoBase,
          getLastPassingVersionEmpty,
          getLastExecutedVersionEmpty,
        ]}
      >
        <PreviousCommits taskId="t2" />
      </MockedProvider>
    ));
    await waitFor(() => {
      expect(queryByText("Go").closest("a")).toHaveAttribute(
        "aria-disabled",
        "true"
      );
    });
    userEvent.click(queryByText("Go to base commit"));
    userEvent.click(queryByText("Go to last executed version"));
    await waitFor(() => {
      expect(queryByText("Go").closest("a")).toHaveAttribute(
        "aria-disabled",
        "true"
      );
    });
    userEvent.click(queryAllByText("Go to last executed version")[0]);
    userEvent.click(queryByText("Go to last passing version"));
    await waitFor(() => {
      expect(queryByText("Go").closest("a")).toHaveAttribute(
        "aria-disabled",
        "true"
      );
    });
  });

  test("The select is disabled when no base version exists", async () => {
    const { queryByText } = renderWithRouterMatch(() => (
      <MockedProvider
        mocks={[
          getTaskWithNoBase,
          getLastPassingVersionEmpty,
          getLastExecutedVersionEmpty,
        ]}
      >
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
                        id:
                          "evergreen_lint_generate_lint_44110b57c6977bf3557009193628c9389772163f_21_11_29_14_13_34",
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

  const getTaskWithNoBase = {
    request: {
      query: GET_BASE_VERSION_AND_TASK,
      variables: {
        taskId: "t2",
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
              order: 3676,
              projectIdentifier: "evergreen",
              __typename: "Version",
            },
            isPatch: true,
            __typename: "Version",
          },
          baseTask: null,
          __typename: "Task",
        },
      },
    },
  };

  const getLastPassingVersionEmpty = {
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
                    tasks: [],
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

  const getLastExecutedVersionEmpty = {
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
                    tasks: [],
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
