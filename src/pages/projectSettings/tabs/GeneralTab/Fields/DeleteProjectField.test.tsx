import { MockedProvider } from "@apollo/client/testing";
import { FieldProps } from "@rjsf/core";
import { RenderFakeToastContext } from "context/toast/__mocks__";
import {
  DeleteProjectMutation,
  DeleteProjectMutationVariables,
} from "gql/generated/types";
import { DELETE_PROJECT } from "gql/mutations";
import {
  renderWithRouterMatch as render,
  screen,
  userEvent,
  waitFor,
} from "test_utils";
import { ApolloMock } from "types/gql";
import { DeleteProjectField } from ".";

const Field = () => (
  <MockedProvider mocks={[deleteProjectMock]}>
    <DeleteProjectField
      {...({} as unknown as FieldProps)}
      uiSchema={{
        options: {
          projectId: "evergreen",
        },
      }}
    />
  </MockedProvider>
);

describe("deleteProject", () => {
  it("renders the button properly", () => {
    const { Component } = RenderFakeToastContext(<Field />);
    render(<Component />);
    expect(screen.getByDataCy("delete-project-button")).toBeInTheDocument();
    expect(
      screen.queryByDataCy("delete-project-modal")
    ).not.toBeInTheDocument();
  });

  it("clicking confirm deletes the project", async () => {
    const { Component, dispatchToast } = RenderFakeToastContext(<Field />);
    render(<Component />, {
      path: "/project/:projectIdentifier/settings",
      route: "/project/evergreen/settings",
    });
    userEvent.click(screen.getByDataCy("delete-project-button"));
    await waitFor(() => {
      expect(screen.getByDataCy("delete-project-modal")).toBeInTheDocument();
    });
    const confirmButton = screen.getByRole("button", {
      name: "Confirm",
    });
    expect(confirmButton).toBeEnabled();
    userEvent.click(confirmButton);

    await waitFor(() => {
      expect(dispatchToast.success).toHaveBeenCalledWith(
        "The project “evergreen” was deleted. Please refresh the page."
      );
    });
  });
});

const deleteProjectMock: ApolloMock<
  DeleteProjectMutation,
  DeleteProjectMutationVariables
> = {
  request: {
    query: DELETE_PROJECT,
    variables: {
      projectId: "evergreen",
    },
  },
  result: {
    data: {
      deleteProject: true,
    },
  },
};
