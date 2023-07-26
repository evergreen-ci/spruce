import { MockedProvider } from "@apollo/client/testing";
import { RenderFakeToastContext } from "context/toast/__mocks__";
import {
  AddAnnotationIssueMutation,
  AddAnnotationIssueMutationVariables,
} from "gql/generated/types";
import { getSpruceConfigMock } from "gql/mocks/getSpruceConfig";
import { ADD_ANNOTATION } from "gql/mutations";
import {
  renderWithRouterMatch as render,
  screen,
  userEvent,
  waitFor,
} from "test_utils";
import { ApolloMock } from "types/gql";
import { AddIssueModal as AddIssueModalToTest } from ".";

const AddIssueModal = (
  props: Omit<
    React.ComponentProps<typeof AddIssueModalToTest>,
    "execution" | "taskId" | "visible"
  >
) => (
  <MockedProvider mocks={[getSpruceConfigMock, addAnnotationMock]}>
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
    const { Component } = RenderFakeToastContext(
      <AddIssueModal
        closeModal={jest.fn()}
        setSelectedRowKey={jest.fn()}
        isIssue
      />
    );
    render(<Component />);

    await waitFor(() => {
      checkModalVisibility();
    });

    expect(screen.queryByDataCy("issue-url")).toHaveValue("");
    expect(
      screen.getByRole("button", {
        name: "Add issue",
      })
    ).toHaveAttribute("aria-disabled", "true");
  });

  it("entering values should enable the submit button", async () => {
    const { Component } = RenderFakeToastContext(
      <AddIssueModal
        closeModal={jest.fn()}
        setSelectedRowKey={jest.fn()}
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
    expect(
      screen.getByRole("button", {
        name: "Add issue",
      })
    ).not.toHaveAttribute("aria-disabled", "true");
  });

  it("entering an invalid confidence score should disable the submit button", async () => {
    const { Component } = RenderFakeToastContext(
      <AddIssueModal
        closeModal={jest.fn()}
        setSelectedRowKey={jest.fn()}
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

    const confirmButton = screen.getByRole("button", {
      name: "Add issue",
    });

    userEvent.type(screen.queryByDataCy("confidence-level"), "not a number");
    expect(confirmButton).toHaveAttribute("aria-disabled", "true");

    userEvent.clear(screen.queryByDataCy("confidence-level"));
    userEvent.type(screen.queryByDataCy("confidence-level"), "110");
    expect(confirmButton).toHaveAttribute("aria-disabled", "true");

    userEvent.clear(screen.queryByDataCy("confidence-level"));
    userEvent.type(screen.queryByDataCy("confidence-level"), "80");
    expect(confirmButton).not.toHaveAttribute("aria-disabled", "true");
  });

  it("should be able to successfully add annotation", async () => {
    const setSelectedRowKey = jest.fn();
    const { Component, dispatchToast } = RenderFakeToastContext(
      <AddIssueModal
        closeModal={jest.fn()}
        setSelectedRowKey={setSelectedRowKey}
        isIssue
      />
    );
    render(<Component />);

    await waitFor(() => {
      checkModalVisibility();
    });

    userEvent.type(
      screen.queryByDataCy("issue-url"),
      "https://jira.mongodb.org/browse/EVG-123"
    );
    userEvent.type(screen.queryByDataCy("confidence-level"), "12");

    const confirmButton = screen.getByRole("button", {
      name: "Add issue",
    });
    expect(confirmButton).not.toHaveAttribute("aria-disabled", "true");
    userEvent.click(confirmButton);
    await waitFor(() => expect(dispatchToast.success).toHaveBeenCalledTimes(1));
    expect(setSelectedRowKey).toHaveBeenCalledWith("EVG-123");
  });
});

const checkModalVisibility = () => {
  expect(screen.getByDataCy("add-issue-modal")).toBeVisible();
  expect(screen.getByDataCy("issue-url")).toBeVisible();
  expect(screen.getByDataCy("confidence-level")).toBeVisible();
};

const addAnnotationMock: ApolloMock<
  AddAnnotationIssueMutation,
  AddAnnotationIssueMutationVariables
> = {
  request: {
    query: ADD_ANNOTATION,
    variables: {
      apiIssue: {
        confidenceScore: 0.12,
        issueKey: "EVG-123",
        url: "https://jira.mongodb.org/browse/EVG-123",
      },
      execution: 0,
      isIssue: true,
      taskId: "1",
    },
  },
  result: {
    data: {
      addAnnotationIssue: true,
    },
  },
};
