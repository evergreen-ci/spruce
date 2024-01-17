import { MockedProvider } from "@apollo/client/testing";
import { FieldProps } from "@rjsf/core";
import { RenderFakeToastContext } from "context/toast/__mocks__";
import {
  AttachProjectToNewRepoMutation,
  AttachProjectToNewRepoMutationVariables,
  AttachProjectToRepoMutation,
  AttachProjectToRepoMutationVariables,
  DetachProjectFromRepoMutation,
  DetachProjectFromRepoMutationVariables,
  GithubOrgsQuery,
  GithubOrgsQueryVariables,
} from "gql/generated/types";
import {
  ATTACH_PROJECT_TO_REPO,
  ATTACH_PROJECT_TO_NEW_REPO,
  DETACH_PROJECT_FROM_REPO,
} from "gql/mutations";
import { GITHUB_ORGS } from "gql/queries";
import {
  renderWithRouterMatch as render,
  screen,
  userEvent,
  waitFor,
} from "test_utils";
import { selectLGOption } from "test_utils/utils";
import { ApolloMock } from "types/gql";
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
  formData = defaultFormData,
  projectType = ProjectType.AttachedProject,
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
      githubOrgs={["evergreen-ci", "10gen"]}
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
      <Field projectType={ProjectType.Project} />,
    );
    render(<Component />);
    expect(screen.queryByDataCy("move-repo-button")).not.toBeInTheDocument();
    expect(screen.getByDataCy("attach-repo-button")).toBeInTheDocument();
  });

  it("disables the attach button when the owner field has been changed and shows a tooltip", async () => {
    const user = userEvent.setup();
    const { Component } = RenderFakeToastContext(
      <Field
        projectType={ProjectType.Project}
        formData={{ owner: "newOwner", repo: defaultFormData.repo }}
      />,
    );
    render(<Component />);

    expect(screen.queryByDataCy("attach-repo-button")).toHaveAttribute(
      "aria-disabled",
      "true",
    );
    expect(
      screen.queryByDataCy("attach-repo-disabled-tooltip"),
    ).not.toBeInTheDocument();
    await user.hover(screen.queryByDataCy("attach-repo-button"));
    await waitFor(() => {
      expect(
        screen.queryByDataCy("attach-repo-disabled-tooltip"),
      ).toBeVisible();
    });
  });

  it("disables the attach button when the repo field has been changed and shows a tooltip", async () => {
    const user = userEvent.setup();
    const { Component } = RenderFakeToastContext(
      <Field
        projectType={ProjectType.Project}
        formData={{ owner: defaultFormData.owner, repo: "newRepo" }}
      />,
    );
    render(<Component />);

    expect(screen.queryByDataCy("attach-repo-button")).toHaveAttribute(
      "aria-disabled",
      "true",
    );
    expect(
      screen.queryByDataCy("attach-repo-disabled-tooltip"),
    ).not.toBeInTheDocument();
    await user.hover(screen.queryByDataCy("attach-repo-button"));
    await waitFor(() => {
      expect(
        screen.queryByDataCy("attach-repo-disabled-tooltip"),
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
      <Field projectType={ProjectType.Repo} />,
    );
    render(<Component />);
    expect(screen.queryByDataCy("move-repo-button")).not.toBeInTheDocument();
    expect(screen.queryByDataCy("attach-repo-button")).not.toBeInTheDocument();
  });

  it("clicking the button opens the modal", async () => {
    const user = userEvent.setup();
    const { Component } = RenderFakeToastContext(<Field />);
    render(<Component />);
    expect(screen.queryByDataCy("move-repo-modal")).not.toBeInTheDocument();

    await screen.findByDataCy("move-repo-button");
    await user.click(screen.queryByDataCy("move-repo-button"));
    await waitFor(() => {
      expect(screen.queryByDataCy("move-repo-modal")).toBeVisible();
    });
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

      expect(
        screen.getByRole("button", {
          name: "Move Project",
        }),
      ).toHaveAttribute("aria-disabled", "true");
    });

    it("prefills the owner dropdown", () => {
      const { Component } = RenderFakeToastContext(<MoveModal />);
      render(<Component />);

      expect(screen.queryByDataCy("new-owner-select")).toHaveTextContent(
        "evergreen-ci",
      );
      expect(
        screen.getByRole("button", {
          name: "Move Project",
        }),
      ).toHaveAttribute("aria-disabled", "true");
    });

    it("enables the confirm button when both fields are updated", async () => {
      const user = userEvent.setup();
      const { Component } = RenderFakeToastContext(<MoveModal />);
      render(<Component />);

      expect(screen.queryByDataCy("new-owner-select")).toHaveTextContent(
        "evergreen-ci",
      );
      await selectLGOption("new-owner-select", "10gen");
      await user.type(screen.queryByDataCy("new-repo-input"), "new-repo-name");
      expect(
        screen.getByRole("button", {
          name: "Move Project",
        }),
      ).not.toHaveAttribute("aria-disabled", "true");
    });
  });

  describe("attachDetachModal", () => {
    it("clicking the button opens the modal", async () => {
      const user = userEvent.setup();
      const { Component } = RenderFakeToastContext(<Field />);
      render(<Component />);

      expect(screen.queryByDataCy("attach-repo-modal")).not.toBeInTheDocument();
      await user.click(screen.queryByDataCy("attach-repo-button"));
      await waitFor(() => {
        expect(screen.queryByDataCy("attach-repo-modal")).toBeVisible();
      });
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
          "Are you sure you want to attach to evergreen-ci/logkeeper?",
        ),
      ).toBeVisible();
    });

    it("successfully attaches to repo", async () => {
      const user = userEvent.setup();
      const { Component, dispatchToast } = RenderFakeToastContext(
        <AttachmentModal />,
      );
      render(<Component />);
      const button = screen.getByRole("button", { name: "Attach" });
      await user.click(button);
      await waitFor(() => expect(dispatchToast.error).not.toHaveBeenCalled());
      await waitFor(() => {
        expect(dispatchToast.success).toHaveBeenCalledWith(
          "Successfully attached to repo",
        );
      });
    });

    it("shows the correct modal text when detaching", () => {
      const { Component } = RenderFakeToastContext(
        <AttachmentModal shouldAttach={false} />,
      );
      render(<Component />);
      expect(
        screen.queryByText(
          "Are you sure you want to detach from evergreen-ci/logkeeper?",
        ),
      ).toBeVisible();
    });

    it("successfully detaches from repo", async () => {
      const user = userEvent.setup();
      const { Component, dispatchToast } = RenderFakeToastContext(
        <AttachmentModal shouldAttach={false} />,
      );
      render(<Component />);
      const button = screen.getByRole("button", { name: "Detach" });
      await user.click(button);
      await waitFor(() => expect(dispatchToast.error).not.toHaveBeenCalled());
      await waitFor(() => {
        expect(dispatchToast.success).toHaveBeenCalledWith(
          "Successfully detached from repo",
        );
      });
    });
  });
});

const attachProjectToNewRepoMock: ApolloMock<
  AttachProjectToNewRepoMutation,
  AttachProjectToNewRepoMutationVariables
> = {
  request: {
    query: ATTACH_PROJECT_TO_NEW_REPO,
    variables: {
      project: {
        projectId: "evergreen",
        newOwner: "evergreen-ci",
        newRepo: "logkeeper",
      },
    },
  },
  result: {
    data: {
      attachProjectToNewRepo: {
        __typename: "Project",
        id: "evergreen",
        repoRefId: "evergreen",
      },
    },
  },
};

const attachProjectToRepoMock: ApolloMock<
  AttachProjectToRepoMutation,
  AttachProjectToRepoMutationVariables
> = {
  request: {
    query: ATTACH_PROJECT_TO_REPO,
    variables: { projectId: "evergreen" },
  },
  result: {
    data: {
      attachProjectToRepo: {
        __typename: "Project",
        id: "evergreen",
      },
    },
  },
};

const detachProjectFromRepoMock: ApolloMock<
  DetachProjectFromRepoMutation,
  DetachProjectFromRepoMutationVariables
> = {
  request: {
    query: DETACH_PROJECT_FROM_REPO,
    variables: { projectId: "evergreen" },
  },
  result: {
    data: {
      detachProjectFromRepo: {
        __typename: "Project",
        id: "evergreen",
      },
    },
  },
};

const getGithubOrgsMock: ApolloMock<GithubOrgsQuery, GithubOrgsQueryVariables> =
  {
    request: {
      query: GITHUB_ORGS,
    },
    result: {
      data: {
        spruceConfig: {
          __typename: "SpruceConfig",
          githubOrgs: ["evergreen-ci", "10gen"],
        },
      },
    },
  };
