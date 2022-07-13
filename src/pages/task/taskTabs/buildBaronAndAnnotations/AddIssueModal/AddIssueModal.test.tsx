import { MockedProvider } from "@apollo/client/testing";
import userEvent from "@testing-library/user-event";
import { RenderFakeToastContext } from "context/__mocks__/toast";
import { getSpruceConfigMock } from "gql/mocks/getSpruceConfig";
import { renderWithRouterMatch as render, screen, waitFor } from "test_utils";
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
    render(<Component />);

    await waitFor(() => {
      checkModalVisibility();
    });

    expect(screen.queryByDataCy("issue-url")).toHaveValue("");
    expect(screen.queryByDataCy("issue-key")).toHaveValue("");
    expect(
      screen.getByRole("button", {
        name: "Add issue",
      })
    ).toBeDisabled();
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
    render(<Component />);

    await waitFor(() => {
      checkModalVisibility();
    });

    expect(screen.queryByDataCy("issue-url")).toHaveValue("");
    userEvent.type(
      screen.queryByDataCy("issue-url"),
      "https://jira.mongodb.org/browse/EVG-123"
    );

    expect(screen.queryByDataCy("issue-key")).toHaveValue("");
    userEvent.type(screen.queryByDataCy("issue-key"), "MONGODB-123");
    expect(
      screen.getByRole("button", {
        name: "Add issue",
      })
    ).not.toBeDisabled();
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
    render(<Component />);

    await waitFor(() => {
      checkModalVisibility();
    });

    expect(screen.queryByDataCy("issue-url")).toHaveValue("");
    userEvent.type(
      screen.queryByDataCy("issue-url"),
      "https://jira.mongodb.org/browse/EVG-123"
    );

    expect(screen.queryByDataCy("issue-key")).toHaveValue("");

    userEvent.type(screen.queryByDataCy("issue-key"), "MONGODB-123");
    userEvent.click(screen.queryByText("Advanced Options"));
    expect(screen.queryByDataCy("confidence-level")).toBeVisible();

    userEvent.type(screen.queryByDataCy("confidence-level"), "not a number");
    expect(
      screen.getByRole("button", {
        name: "Add issue",
      })
    ).toBeDisabled();
    userEvent.clear(screen.queryByDataCy("confidence-level"));

    userEvent.type(screen.queryByDataCy("confidence-level"), "110");

    expect(
      screen.getByRole("button", {
        name: "Add issue",
      })
    ).toBeDisabled();
    userEvent.clear(screen.queryByDataCy("confidence-level"));

    userEvent.type(screen.queryByDataCy("confidence-level"), "80");
    expect(
      screen.getByRole("button", {
        name: "Add issue",
      })
    ).not.toBeDisabled();
  });
});

const checkModalVisibility = () => {
  expect(screen.getByDataCy("add-issue-modal")).toBeVisible();
  expect(screen.getByDataCy("issue-url")).toBeVisible();
  expect(screen.getByDataCy("issue-key")).toBeVisible();
  expect(screen.getByDataCy("confidence-level")).toBeVisible();
};
