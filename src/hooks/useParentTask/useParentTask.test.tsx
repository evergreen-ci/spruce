import { MockedProvider, MockedProviderProps } from "@apollo/client/testing";
import {
  BaseVersionAndTaskQuery,
  BaseVersionAndTaskQueryVariables,
} from "gql/generated/types";
import { BASE_VERSION_AND_TASK } from "gql/queries";
import { renderHook, waitFor } from "test_utils";
import { ApolloMock } from "types/gql";
import { useParentTask } from ".";

interface ProviderProps {
  mocks?: MockedProviderProps["mocks"];
  children: React.ReactNode;
}
const ProviderWrapper: React.FC<ProviderProps> = ({ children, mocks = [] }) => (
  <MockedProvider mocks={mocks}>{children}</MockedProvider>
);

describe("useParentTask", () => {
  it("no parent task is found when task is not found", async () => {
    const { result } = renderHook(() => useParentTask("t1"), {
      wrapper: ({ children }) => ProviderWrapper({ children }),
    });

    expect(result.current.task).toBeUndefined();
  });
  it("a parent task is found", async () => {
    const { result } = renderHook(() => useParentTask("t1"), {
      wrapper: ({ children }) =>
        ProviderWrapper({
          children,
          mocks: [getPatchTaskWithFailingBaseTask],
        }),
    });

    await waitFor(() => {
      expect(result.current.task).toBeDefined();
    });

    expect(result.current.task.id).toBe("task");
  });
});

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
        status: "failed",
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
          id: "task",
          execution: 0,
          status: "failed",
          __typename: "Task",
        },
        __typename: "Task",
      },
    },
  },
};
