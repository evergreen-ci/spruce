import { MockedProvider } from "@apollo/client/testing";
import { FieldProps } from "@rjsf/core";
import { RenderFakeToastContext } from "context/__mocks__/toast";
import {
  ATTACH_PROJECT_TO_REPO,
  ATTACH_PROJECT_TO_NEW_REPO,
  DETACH_PROJECT_FROM_REPO,
} from "gql/mutations";
import { GET_GITHUB_ORGS } from "gql/queries";
import {
  renderWithRouterMatch as render,
  screen,
  userEvent,
  waitFor,
} from "test_utils";
import { ProjectType } from "../../utils";
import { AttachDetachModal } from "./AttachDetachModal";
import { MoveRepoModal } from "./MoveRepoModal";
import { RepoConfigField } from "./RepoConfigField";

const fieldProps = {
  onChange: () => {},
  schema: {},
  uiSchema: {},
} as unknown as FieldProps;

const defaultFormData = {
  owner: "evergreen-ci",
  repo: "logkeeper",
};

const Field = ({
  projectType = ProjectType.AttachedProject,
  formData = defaultFormData,
}: {
  projectType?: ProjectType;
  formData?: { owner: string; repo: string };
}) => (
  <MockedProvider mocks={[getGithubOrgsMock]}>
    <RepoConfigField
      {...fieldProps}
      formData={formData}
      uiSchema={{
        options: {
          initialOwner: "evergreen-ci",
          initialRepo: "logkeeper",
          repoName: "evergreen",
          repoOwner: "evergreen-ci",
          projectId: "evergreen",
          projectType,
        },
      }}
    />
  </MockedProvider>
);

const AttachmentModal = ({
  shouldAttach = true,
}: {
  shouldAttach?: boolean;
}) => (
  <MockedProvider mocks={[attachProjectToRepoMock, detachProjectFromRepoMock]}>
    <AttachDetachModal
      handleClose={() => {}}
      open
      projectId="evergreen"
      repoName={defaultFormData.repo}
      repoOwner={defaultFormData.owner}
      shouldAttach={shouldAttach}
    />
  </MockedProvider>
);

const MoveModal = ({ open = true }: { open?: boolean }) => (
  <MockedProvider mocks={[attachProjectToNewRepoMock]}>
    <MoveRepoModal
      githubOrgs={["evergreen-ci"]}
      handleClose={() => {}}
      open={open}
      projectId="evergreen"
      repoName="spruce"
      repoOwner="evergreen-ci"
    />
  </MockedProvider>
);

describe("repoConfigField", () => {
  it("only shows the attach to repo button when not attached to repo", () => {
    const { Component } = RenderFakeToastContext(
      <Field projectType={ProjectType.Project} />
    );
    render(<Component />);
    expect(screen.queryByDataCy("move-repo-button")).not.toBeInTheDocument();
    expect(screen.getByDataCy("attach-repo-button")).toBeInTheDocument();
  });

  it("disables the attach button when the owner field has been changed and shows a tooltip", async () => {
    const { Component } = RenderFakeToastContext(
      <Field
        projectType={ProjectType.Project}
        formData={{ owner: "newOwner", repo: defaultFormData.repo }}
      />
    );
    render(<Component />);
    expect(screen.queryByDataCy("attach-repo-button")).toHaveAttribute(
      "disabled"
    );

    expect(
      screen.queryByDataCy("attach-repo-disabled-tooltip")
    ).not.toBeInTheDocument();
    userEvent.hover(screen.queryByDataCy("attach-repo-button-wrapper"));
    await waitFor(() => {
      expect(
        screen.queryByDataCy("attach-repo-disabled-tooltip")
      ).toBeVisible();
    });
  });

  it("disables the attach button when the repo field has been changed and shows a tooltip", async () => {
    const { Component } = RenderFakeToastContext(
      <Field
        projectType={ProjectType.Project}
        formData={{ owner: defaultFormData.owner, repo: "newRepo" }}
      />
    );
    render(<Component />);
    expect(screen.queryByDataCy("attach-repo-button")).toHaveAttribute(
      "disabled"
    );

    expect(
      screen.queryByDataCy("attach-repo-disabled-tooltip")
    ).not.toBeInTheDocument();
    userEvent.hover(screen.queryByDataCy("attach-repo-button-wrapper"));
    await waitFor(() => {
      expect(
        screen.queryByDataCy("attach-repo-disabled-tooltip")
      ).toBeVisible();
    });
  });

  it("shows both buttons for an attached project", async () => {
    const { Component } = RenderFakeToastContext(<Field />);
    render(<Component />);
    await screen.findByDataCy("move-repo-button");
    expect(screen.getByDataCy("attach-repo-button")).toBeInTheDocument();
  });

  it("does not show either button for project type repo", () => {
    const { Component } = RenderFakeToastContext(
      <Field projectType={ProjectType.Repo} />
    );
    render(<Component />);
    expect(screen.queryByDataCy("move-repo-button")).not.toBeInTheDocument();
    expect(screen.queryByDataCy("attach-repo-button")).not.toBeInTheDocument();
  });

  it("clicking the button opens the modal", async () => {
    const { Component } = RenderFakeToastContext(<Field />);
    render(<Component />);
    expect(screen.queryByDataCy("move-repo-modal")).not.toBeInTheDocument();

    await screen.findByDataCy("move-repo-button");
    userEvent.click(screen.queryByDataCy("move-repo-button"));
    await waitFor(() =>
      expect(screen.queryByDataCy("move-repo-modal")).toBeVisible()
    );
  });

  describe("moveRepoModal", () => {
    it("renders the Move Repo Modal when the open prop is true", () => {
      const { Component } = RenderFakeToastContext(<MoveModal />);
      render(<Component />);
      expect(screen.queryByDataCy("move-repo-modal")).toBeVisible();
    });

    it("does not render the Move Repo Modal when the open prop is false", () => {
      const { Component } = RenderFakeToastContext(<MoveModal open={false} />);
      render(<Component />);
      expect(screen.queryByDataCy("move-repo-modal")).not.toBeInTheDocument();
    });

    it("disables the confirm button on initial render", () => {
      const { Component } = RenderFakeToastContext(<MoveModal />);
      render(<Component />);

      const moveRepoButton = screen.getByRole("button", {
        name: "Move Project",
      });
      expect(moveRepoButton).toHaveAttribute("disabled");
    });

    it("disables the confirm button when only owner field is updated", () => {
      const { Component } = RenderFakeToastContext(<MoveModal />);
      render(<Component />);

      userEvent.type(screen.queryByDataCy("new-owner-input"), "new-owner-name");
      const moveRepoButton = screen.getByRole("button", {
        name: "Move Project",
      });
      expect(moveRepoButton).toHaveAttribute("disabled");
    });

    it("disables the confirm button when only repo field is updated", () => {
      const { Component } = RenderFakeToastContext(<MoveModal />);
      render(<Component />);

      userEvent.type(screen.queryByDataCy("new-repo-input"), "new-repo-name");
      const moveRepoButton = screen.getByRole("button", {
        name: "Move Project",
      });
      expect(moveRepoButton).toHaveAttribute("disabled");
    });

    it("enables the confirm button when both fields are updated", () => {
      const { Component } = RenderFakeToastContext(<MoveModal />);
      render(<Component />);

      userEvent.type(screen.queryByDataCy("new-owner-input"), "new-owner-name");
      userEvent.type(screen.queryByDataCy("new-repo-input"), "new-repo-name");
      const moveRepoButton = screen.getByRole("button", {
        name: "Move Project",
      });
      expect(moveRepoButton).not.toHaveAttribute("disabled");
    });
  });

  describe("attachDetachModal", () => {
    afterEach(() => {
      jest.restoreAllMocks();
    });

    it("clicking the button opens the modal", async () => {
      const { Component } = RenderFakeToastContext(<Field />);
      render(<Component />);

      expect(screen.queryByDataCy("attach-repo-modal")).not.toBeInTheDocument();
      const attachRepoButton = screen.queryByDataCy("attach-repo-button");
      userEvent.click(attachRepoButton);
      await waitFor(() =>
        expect(screen.queryByDataCy("attach-repo-modal")).toBeVisible()
      );
    });

    it("renders the modal when the open prop is true", () => {
      const { Component } = RenderFakeToastContext(<AttachmentModal />);
      render(<Component />);
      expect(screen.queryByDataCy("attach-repo-modal")).toBeVisible();
    });

    it("shows the correct modal text when attaching", () => {
      const { Component } = RenderFakeToastContext(<AttachmentModal />);
      render(<Component />);
      expect(
        screen.queryByText(
          "Are you sure you want to attach to evergreen-ci/logkeeper?"
        )
      ).toBeVisible();
    });

    it("successfully attaches to repo", async () => {
      const { Component, dispatchToast } = RenderFakeToastContext(
        <AttachmentModal />
      );
      render(<Component />);

      userEvent.click(screen.queryByText("Attach"));
      await waitFor(() => expect(dispatchToast.error).not.toHaveBeenCalled());
      await waitFor(() => {
        expect(dispatchToast.success).toHaveBeenCalledWith(
          "Successfully attached to repo"
        );
      });
    });

    it("shows the correct modal text when detaching", () => {
      const { Component } = RenderFakeToastContext(
        <AttachmentModal shouldAttach={false} />
      );
      render(<Component />);
      expect(
        screen.queryByText(
          "Are you sure you want to detach from evergreen-ci/logkeeper?"
        )
      ).toBeVisible();
    });

    it("successfully detaches from repo", async () => {
      const { Component, dispatchToast } = RenderFakeToastContext(
        <AttachmentModal shouldAttach={false} />
      );
      render(<Component />);

      userEvent.click(screen.queryByText("Detach"));
      await waitFor(() => expect(dispatchToast.error).not.toHaveBeenCalled());
      await waitFor(() => {
        expect(dispatchToast.success).toHaveBeenCalledWith(
          "Successfully detached from repo"
        );
      });
    });
  });
});

const attachProjectToNewRepoMock = {
  request: {
    query: ATTACH_PROJECT_TO_NEW_REPO,
    variables: {
      projectId: "evergreen",
      newOwner: "evergreen-ci",
      newRepo: "logkeeper",
    },
  },
  result: {
    data: {
      id: "evergreen",
    },
  },
};

const attachProjectToRepoMock = {
  request: {
    query: ATTACH_PROJECT_TO_REPO,
    variables: { projectId: "evergreen" },
  },
  result: {
    data: {
      attachProjectToRepo: {
        id: "evergreen",
      },
    },
  },
};

const detachProjectFromRepoMock = {
  request: {
    query: DETACH_PROJECT_FROM_REPO,
    variables: { projectId: "evergreen" },
  },
  result: {
    data: {
      detachProjectFromRepo: {
        id: "evergreen",
      },
    },
  },
};

const getGithubOrgsMock = {
  request: {
    query: GET_GITHUB_ORGS,
  },
  result: {
    data: {
      spruceConfig: {
        githubOrgs: ["evergreen-ci"],
      },
    },
  },
};
