import { MockedProvider } from "@apollo/client/testing";
import userEvent from "@testing-library/user-event";
import { RenderFakeToastContext } from "context/__mocks__/toast";
import { getSpruceConfigMock } from "gql/mocks/getSpruceConfig";
import { renderWithRouterMatch as render, act } from "test_utils";
import { AddIssueModal as AddIssueModalToTest } from ".";

const AddIssueModal = (
  props: Omit<
    React.ComponentProps<typeof AddIssueModalToTest>,
    "execution" | "taskId" | "visible"
  >
) => (
  <MockedProvider mocks={[getSpruceConfigMock]}>
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
  it("should have submit disabled by default when all the fields are empty", async () => {
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
    await act(() => new Promise((resolve) => setTimeout(resolve, 0)));

    expect(queryByDataCy("issue-url")).toHaveValue("");
    expect(queryByDataCy("issue-key")).toHaveValue("");
    expect(queryByText("Add issue").closest("button")).toBeDisabled();
  });
  it("entering values should enable the submit button", async () => {
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
    await act(() => new Promise((resolve) => setTimeout(resolve, 0)));

    expect(queryByDataCy("issue-url")).toHaveValue("");
    userEvent.type(
      queryByDataCy("issue-url"),
      "https://jira.mongodb.org/browse/EVG-123"
    );

    expect(queryByDataCy("issue-key")).toHaveValue("");
    userEvent.type(queryByDataCy("issue-key"), "MONGODB-123");

    expect(queryByText("Add issue").closest("button")).not.toBeDisabled();
  });
  it("entering an invalid confidence score should disable the submit button", async () => {
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
    await act(() => new Promise((resolve) => setTimeout(resolve, 0)));

    expect(queryByDataCy("issue-url")).toHaveValue("");
    userEvent.type(
      queryByDataCy("issue-url"),
      "https://jira.mongodb.org/browse/EVG-123"
    );

    expect(queryByDataCy("issue-key")).toHaveValue("");

    userEvent.type(queryByDataCy("issue-key"), "MONGODB-123");
    userEvent.click(queryByText("Advanced Options"));
    expect(queryByDataCy("confidence-level")).toBeVisible();

    userEvent.type(queryByDataCy("confidence-level"), "not a number");
    expect(queryByText("Add issue").closest("button")).toBeDisabled();
    userEvent.clear(queryByDataCy("confidence-level"));

    userEvent.type(queryByDataCy("confidence-level"), "110");

    expect(queryByText("Add issue").closest("button")).toBeDisabled();
    userEvent.clear(queryByDataCy("confidence-level"));

    userEvent.type(queryByDataCy("confidence-level"), "80");
    expect(queryByText("Add issue").closest("button")).not.toBeDisabled();
  });
});
