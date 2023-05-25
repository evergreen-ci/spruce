import { MockedProvider } from "@apollo/client/testing";
import { RenderFakeToastContext } from "context/toast/__mocks__";
import {
  SetPatchPriorityMutation,
  SetPatchPriorityMutationVariables,
  SetTaskPriorityMutation,
  SetTaskPriorityMutationVariables,
} from "gql/generated/types";
import { SET_PATCH_PRIORITY, SET_TASK_PRIORITY } from "gql/mutations";
import { renderWithRouterMatch, screen, userEvent, waitFor } from "test_utils";
import { ApolloMock } from "types/gql";
import SetPriority from ".";

describe("setPriority", () => {
  describe("patch priority", () => {
    it("shows warning", async () => {
      const { Component } = RenderFakeToastContext(
        <MockedProvider mocks={[setPatchPriority]}>
          <SetPriority patchId="patch_id" />
        </MockedProvider>
      );
      renderWithRouterMatch(<Component />);

      userEvent.click(screen.queryByDataCy("prioritize-patch"));
      await waitFor(() => {
        expect(
          screen.queryByDataCy("set-patch-priority-popconfirm")
        ).toBeVisible();
      });
      expect(screen.queryByDataCy("priority-warning")).toBeNull();
      userEvent.type(screen.queryByDataCy("patch-priority-input"), "99");
      expect(screen.queryByDataCy("priority-warning")).toBeVisible();
    });

    it("successfully sets priority", async () => {
      const { Component, dispatchToast } = RenderFakeToastContext(
        <MockedProvider mocks={[setPatchPriority]}>
          <SetPriority patchId="patch_id" />
        </MockedProvider>
      );
      renderWithRouterMatch(<Component />);

      userEvent.click(screen.queryByDataCy("prioritize-patch"));
      await waitFor(() => {
        expect(
          screen.queryByDataCy("set-patch-priority-popconfirm")
        ).toBeVisible();
      });
      userEvent.type(screen.queryByDataCy("patch-priority-input"), "99");
      userEvent.click(screen.getByRole("button", { name: "Set" }));
      await waitFor(() =>
        expect(dispatchToast.success).toHaveBeenCalledTimes(1)
      );
    });
  });

  describe("task priority", () => {
    it("shows correct initial priority", async () => {
      const { Component } = RenderFakeToastContext(
        <MockedProvider mocks={[setTaskPriority]}>
          <SetPriority taskId="task_id" initialPriority={10} />
        </MockedProvider>
      );
      renderWithRouterMatch(<Component />);

      userEvent.click(screen.queryByDataCy("prioritize-task"));
      await waitFor(() => {
        expect(
          screen.queryByDataCy("set-task-priority-popconfirm")
        ).toBeVisible();
      });
      expect(screen.queryByDataCy("task-priority-input")).toHaveValue(10);
    });

    it("shows warning", async () => {
      const { Component } = RenderFakeToastContext(
        <MockedProvider mocks={[setTaskPriority]}>
          <SetPriority taskId="task_id" />
        </MockedProvider>
      );
      renderWithRouterMatch(<Component />);

      userEvent.click(screen.queryByDataCy("prioritize-task"));
      await waitFor(() => {
        expect(
          screen.queryByDataCy("set-task-priority-popconfirm")
        ).toBeVisible();
      });
      expect(screen.queryByDataCy("priority-warning")).toBeNull();
      userEvent.type(screen.queryByDataCy("task-priority-input"), "99");
      expect(screen.queryByDataCy("priority-warning")).toBeVisible();
    });

    it("successfully sets priority", async () => {
      const { Component, dispatchToast } = RenderFakeToastContext(
        <MockedProvider mocks={[setTaskPriority]}>
          <SetPriority taskId="task_id" />
        </MockedProvider>
      );
      renderWithRouterMatch(<Component />);

      userEvent.click(screen.queryByDataCy("prioritize-task"));
      await waitFor(() => {
        expect(
          screen.queryByDataCy("set-task-priority-popconfirm")
        ).toBeVisible();
      });
      userEvent.type(screen.queryByDataCy("task-priority-input"), "99");
      userEvent.click(screen.getByRole("button", { name: "Set" }));
      await waitFor(() =>
        expect(dispatchToast.success).toHaveBeenCalledTimes(1)
      );
    });
  });
});

const setPatchPriority: ApolloMock<
  SetPatchPriorityMutation,
  SetPatchPriorityMutationVariables
> = {
  request: {
    query: SET_PATCH_PRIORITY,
    variables: { patchId: "patch_id", priority: 99 },
  },
  result: {
    data: {
      setPatchPriority: "patch_id",
    },
  },
};

const setTaskPriority: ApolloMock<
  SetTaskPriorityMutation,
  SetTaskPriorityMutationVariables
> = {
  request: {
    query: SET_TASK_PRIORITY,
    variables: { taskId: "task_id", priority: 99 },
  },
  result: {
    data: {
      setTaskPriority: {
        __typename: "Task",
        execution: 0,
        id: "task_id",
        priority: 99,
      },
    },
  },
};
