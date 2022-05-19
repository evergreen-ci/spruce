import { MockedProvider, MockedResponse } from "@apollo/client/testing";
import userEvent from "@testing-library/user-event";
import { GraphQLError } from "graphql";
import { RenderFakeToastContext } from "context/__mocks__/toast";
import { COPY_PROJECT } from "gql/mutations";
import { GET_PROJECT_SETTINGS, GET_REPO_SETTINGS } from "gql/queries";
import { renderWithRouterMatch as render, waitFor } from "test_utils";
import { CopyProjectModal } from "./CopyProjectModal";

const newProjectIdentifier = "new_evergreen";
const projectIdToCopy = "evg";

const Modal = ({
  mock = copyProjectMock,
  open = true,
}: {
  mock?: MockedResponse;
  open?: boolean;
}) => (
  <MockedProvider
    mocks={[mock, projectSettingsMock, repoSettingsMock]}
    addTypename={false}
  >
    <CopyProjectModal
      handleClose={() => {}}
      id={projectIdToCopy}
      label="evergreen"
      open={open}
    />
  </MockedProvider>
);

describe("createProjectField", () => {
  it("does not render the modal when open prop is false", async () => {
    const { Component } = RenderFakeToastContext(<Modal open={false} />);
    const { queryByDataCy } = render(<Component />);

    expect(queryByDataCy("copy-project-modal")).not.toBeInTheDocument();
  });

  it("disables the confirm button on initial render and uses the provided label", async () => {
    const { Component } = RenderFakeToastContext(<Modal />);
    const { queryByDataCy, queryByText } = render(<Component />);

    await waitFor(() =>
      expect(queryByText("Duplicate “evergreen”")).toBeVisible()
    );

    expect(queryByDataCy("copy-project-modal")).toBeInTheDocument();
    await waitFor(() => {
      const confirmButton = queryByText("Duplicate").closest("button");
      expect(confirmButton).toBeDisabled();
    });
  });

  it("submits the modal when a project name is provided", async () => {
    const { Component, dispatchToast } = RenderFakeToastContext(<Modal />);
    const { queryByDataCy, queryByText } = render(<Component />);

    await waitFor(() =>
      expect(queryByDataCy("copy-project-modal")).toBeInTheDocument()
    );
    userEvent.type(queryByDataCy("project-name-input"), newProjectIdentifier);

    await waitFor(() => {
      const confirmButton = queryByText("Duplicate").closest("button");
      expect(confirmButton).toBeEnabled();
    });

    userEvent.click(queryByText("Duplicate"));
    await waitFor(() => expect(dispatchToast.success).toHaveBeenCalledTimes(1));
    await waitFor(() => expect(dispatchToast.warning).toHaveBeenCalledTimes(0));
    await waitFor(() => expect(dispatchToast.error).toHaveBeenCalledTimes(0));
  });

  it("submits the modal when a project name and id are provided", async () => {
    const mockWithId = {
      request: {
        query: COPY_PROJECT,
        variables: {
          project: {
            newProjectId: "evg_id",
            newProjectIdentifier,
            projectIdToCopy,
          },
        },
      },
      result: {
        data: {
          copyProject: {
            identifier: newProjectIdentifier,
          },
        },
      },
    };
    const { Component, dispatchToast } = RenderFakeToastContext(
      <Modal mock={mockWithId} />
    );
    const { queryByDataCy, queryByText } = render(<Component />);

    await waitFor(() =>
      expect(queryByDataCy("copy-project-modal")).toBeInTheDocument()
    );
    userEvent.type(queryByDataCy("project-id-input"), "evg_id");
    userEvent.type(queryByDataCy("project-name-input"), newProjectIdentifier);

    await waitFor(() => {
      const confirmButton = queryByText("Duplicate").closest("button");
      expect(confirmButton).toBeEnabled();
    });

    userEvent.click(queryByText("Duplicate"));
    await waitFor(() => expect(dispatchToast.success).toHaveBeenCalledTimes(1));
    await waitFor(() => expect(dispatchToast.warning).toHaveBeenCalledTimes(0));
    await waitFor(() => expect(dispatchToast.error).toHaveBeenCalledTimes(0));
  });

  it("shows a warning toast when an error and data are returned", async () => {
    const mockWithError = {
      request: {
        query: COPY_PROJECT,
        variables: {
          project: {
            newProjectIdentifier,
            projectIdToCopy,
          },
        },
      },
      result: {
        data: {
          copyProject: {
            identifier: newProjectIdentifier,
          },
        },
        errors: [new GraphQLError("There was an error copying the project")],
      },
    };
    const { Component, dispatchToast } = RenderFakeToastContext(
      <Modal mock={mockWithError} />
    );
    const { queryByDataCy, queryByText } = render(<Component />);

    await waitFor(() =>
      expect(queryByDataCy("copy-project-modal")).toBeInTheDocument()
    );
    userEvent.type(queryByDataCy("project-name-input"), newProjectIdentifier);

    await waitFor(() => {
      const confirmButton = queryByText("Duplicate").closest("button");
      expect(confirmButton).toBeEnabled();
    });

    userEvent.click(queryByText("Duplicate"));
    await waitFor(() => expect(dispatchToast.success).toHaveBeenCalledTimes(0));
    await waitFor(() => expect(dispatchToast.warning).toHaveBeenCalledTimes(1));
    await waitFor(() => expect(dispatchToast.error).toHaveBeenCalledTimes(0));
  });

  it("shows a warning toast when no data is returned", async () => {
    const mockWithError = {
      request: {
        query: COPY_PROJECT,
        variables: {
          project: {
            newProjectIdentifier,
            projectIdToCopy,
          },
        },
      },
      result: {
        errors: [new GraphQLError("There was an error copying the project")],
      },
    };
    const { Component, dispatchToast } = RenderFakeToastContext(
      <Modal mock={mockWithError} />
    );
    const { queryByDataCy, queryByText } = render(<Component />);

    await waitFor(() =>
      expect(queryByDataCy("copy-project-modal")).toBeInTheDocument()
    );
    userEvent.type(queryByDataCy("project-name-input"), newProjectIdentifier);

    await waitFor(() => {
      const confirmButton = queryByText("Duplicate").closest("button");
      expect(confirmButton).toBeEnabled();
    });

    userEvent.click(queryByText("Duplicate"));
    await waitFor(() => expect(dispatchToast.success).toHaveBeenCalledTimes(0));
    await waitFor(() => expect(dispatchToast.warning).toHaveBeenCalledTimes(0));
    await waitFor(() => expect(dispatchToast.error).toHaveBeenCalledTimes(1));
  });
});

const copyProjectMock = {
  request: {
    query: COPY_PROJECT,
    variables: {
      project: {
        newProjectIdentifier,
        projectIdToCopy,
      },
    },
  },
  result: {
    data: {
      copyProject: {
        identifier: newProjectIdentifier,
      },
    },
  },
};

const projectSettingsMock = {
  request: {
    query: GET_PROJECT_SETTINGS,
    variables: {
      identifier: newProjectIdentifier,
    },
  },
  result: {
    data: {
      projectSettings: {},
    },
  },
};

const repoSettingsMock = {
  request: {
    query: GET_REPO_SETTINGS,
    variables: {
      id: newProjectIdentifier,
    },
  },
  result: {
    data: {
      repoSettings: {},
    },
  },
};
