import { MockedProvider } from "@apollo/client/testing";
import { RenderFakeToastContext } from "context/__mocks__/toast";
import { fireEvent, renderWithRouterMatch as render } from "test_utils";
import { AddIssueModal as AddIssueModalToTest } from ".";

const AddIssueModal = (
  props: Omit<
    React.ComponentProps<typeof AddIssueModalToTest>,
    "execution" | "taskId" | "visible"
  >
) => (
  <MockedProvider>
    <AddIssueModalToTest
      taskId="1"
      execution={0}
      visible
      data-cy="add-issue-modal"
      {...props}
    />
  </MockedProvider>
);
describe("addIssueModal", () => {
  it("should have submit disabled by default when all the fields are empty", () => {
    const closeModal = jest.fn();
    const setSelectedRowKey = jest.fn();

    const { Component } = RenderFakeToastContext(
      <AddIssueModal
        closeModal={closeModal}
        setSelectedRowKey={setSelectedRowKey}
        isIssue
      />
    );
    const { queryByText, queryByDataCy } = render(Component);
    expect(queryByDataCy("issue-url")).toHaveValue("");
    expect(queryByDataCy("issue-key")).toHaveValue("");
    expect(queryByText("Add issue").closest("button")).toBeDisabled();
  });
  it("entering values should enable the submit button", () => {
    const closeModal = jest.fn();
    const setSelectedRowKey = jest.fn();

    const { Component } = RenderFakeToastContext(
      <AddIssueModal
        closeModal={closeModal}
        setSelectedRowKey={setSelectedRowKey}
        isIssue
      />
    );
    const { queryByText, queryByDataCy } = render(Component);
    expect(queryByDataCy("issue-url")).toHaveValue("");
    fireEvent.change(queryByDataCy("issue-url"), {
      target: { value: "https://mongodb.com" },
    });
    expect(queryByDataCy("issue-key")).toHaveValue("");
    fireEvent.change(queryByDataCy("issue-key"), {
      target: { value: "MONGODB-123" },
    });

    expect(queryByText("Add issue").closest("button")).not.toBeDisabled();
  });
  it("entering an invalid confidence score should disable the submit button", () => {
    const closeModal = jest.fn();
    const setSelectedRowKey = jest.fn();

    const { Component } = RenderFakeToastContext(
      <AddIssueModal
        closeModal={closeModal}
        setSelectedRowKey={setSelectedRowKey}
        isIssue
      />
    );
    const { queryByText, queryByDataCy } = render(Component);
    expect(queryByDataCy("issue-url")).toHaveValue("");
    fireEvent.change(queryByDataCy("issue-url"), {
      target: { value: "https://mongodb.com" },
    });
    expect(queryByDataCy("issue-key")).toHaveValue("");
    fireEvent.change(queryByDataCy("issue-key"), {
      target: { value: "MONGODB-123" },
    });
    fireEvent.click(queryByText("Advanced Options"));
    expect(queryByDataCy("confidence-level")).toBeVisible();
    fireEvent.change(queryByDataCy("confidence-level"), {
      target: { value: "not a number" },
    });
    // debug();
    expect(queryByText("Add issue").closest("button")).toBeDisabled();
    fireEvent.change(queryByDataCy("confidence-level"), {
      target: { value: "110" },
    });
    expect(queryByText("Add issue").closest("button")).toBeDisabled();
    fireEvent.change(queryByDataCy("confidence-level"), {
      target: { value: "80" },
    });
    expect(queryByText("Add issue").closest("button")).not.toBeDisabled();
  });
});
