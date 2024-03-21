import { MockedProvider, MockedProviderProps } from "@apollo/client/testing";
import { RenderFakeToastContext } from "context/toast/__mocks__";
import {
  BaseVersionAndTaskQuery,
  BaseVersionAndTaskQueryVariables,
  LastMainlineCommitQuery,
  LastMainlineCommitQueryVariables,
} from "gql/generated/types";
import { BASE_VERSION_AND_TASK, LAST_MAINLINE_COMMIT } from "gql/queries";
import { renderHook, waitFor } from "test_utils";
import { ApolloMock } from "types/gql";
import { useLastExecutedTask } from ".";

interface ProviderProps {
  mocks?: MockedProviderProps["mocks"];
  children: React.ReactNode;
}
const ProviderWrapper: React.FC<ProviderProps> = ({ children, mocks = [] }) => (
  <MockedProvider mocks={mocks}>{children}</MockedProvider>
);

describe("useLastExecutedTask", () => {
  it("no last executed task is found when task is not found", () => {
    const { dispatchToast } = RenderFakeToastContext();

    const { result } = renderHook(() => useLastExecutedTask("t1"), {
      wrapper: ({ children }) => ProviderWrapper({ children }),
    });

    expect(result.current.task).toBeUndefined();

    // No error is dispatched when the task is not found.
    expect(dispatchToast.error).toHaveBeenCalledTimes(0);
  });
  it("a last executed task is found", async () => {
    const { dispatchToast } = RenderFakeToastContext();

    const { result } = renderHook(() => useLastExecutedTask("t1"), {
      wrapper: ({ children }) =>
        ProviderWrapper({
          children,
          mocks: [getPatchTaskWithRunningBaseTask, getLastExecutedVersion],
        }),
    });

    await waitFor(() => {
      expect(result.current.task).toBeDefined();
    });

    expect(result.current.task.id).toBe("last_executed_task");

    // No error is dispatched for success scenarios.
    expect(dispatchToast.error).toHaveBeenCalledTimes(0);
  });
  it("a last executed task is not found due to an error in the query and a toast is dispatched", async () => {
    const { dispatchToast } = RenderFakeToastContext();

    const { result } = renderHook(() => useLastExecutedTask("t1"), {
      wrapper: ({ children }) =>
        ProviderWrapper({
          children,
          mocks: [
            getPatchTaskWithRunningBaseTask,
            getLastExecutedVersionWithError,
          ],
        }),
    });

    await waitFor(() => {
      // An error is dispatched when the query fails.
      expect(dispatchToast.error).toHaveBeenCalledTimes(1);
    });

    expect(result.current.task).toBeUndefined();
  });
});

const baseTaskId =
  "evergreen_lint_lint_agent_f4fe4814088e13b8ef423a73d65a6e0a5579cf93_21_11_29_17_55_27";

const getPatchTaskWithRunningBaseTask: ApolloMock<
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

const getLastExecutedVersionWithError: ApolloMock<
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
  error: new Error("Matching task not found!"),
};
