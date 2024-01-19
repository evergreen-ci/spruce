import { MockedProvider } from "@apollo/client/testing";
import { FieldProps } from "@rjsf/core";
import { RenderFakeToastContext } from "context/toast/__mocks__";
import {
  DeleteProjectMutation,
  DeleteProjectMutationVariables,
} from "gql/generated/types";
import { DELETE_PROJECT } from "gql/mutations";
import { renderWithRouterMatch as render, screen, userEvent } from "test_utils";
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
      screen.queryByDataCy("delete-project-modal"),
    ).not.toBeInTheDocument();
  });

  it("clicking confirm deletes the project", async () => {
    const user = userEvent.setup();

    const { Component, dispatchToast } = RenderFakeToastContext(<Field />);
    render(<Component />, {
      path: "/project/:projectIdentifier/settings",
      route: "/project/evergreen/settings",
    });
    await user.click(screen.getByDataCy("delete-project-button"));
    expect(screen.getByDataCy("delete-project-modal")).toBeInTheDocument();
    const deleteButton = screen.getByRole("button", {
      name: "Delete",
    });
    expect(deleteButton).toBeEnabled();
    await user.click(deleteButton);
    expect(dispatchToast.success).toHaveBeenCalledWith(
      "The project “evergreen” was deleted. Future visits to this page will result in an error.",
    );
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
