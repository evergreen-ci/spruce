import { MockedProvider } from "@apollo/client/testing";
import { FieldProps } from "@rjsf/core";
import userEvent from "@testing-library/user-event";
import { RenderFakeToastContext } from "context/__mocks__/toast";
import {
  ATTACH_PROJECT_TO_REPO,
  ATTACH_PROJECT_TO_NEW_REPO,
  DETACH_PROJECT_FROM_REPO,
} from "gql/mutations";
import { render, fireEvent, waitFor } from "test_utils";
import { ProjectType } from "../../utils";
import { AttachDetachModal } from "./AttachDetachModal";
import { MoveRepoModal } from "./MoveRepoModal";
import { RepoConfigField } from "./RepoConfigField";

const fieldProps = ({
  onChange: () => {},
  schema: {},
  uiSchema: {},
} as unknown) as FieldProps;

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
  <MockedProvider mocks={[attachProjectToRepoMock, detachProjectFromRepoMock]}>
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
    const { queryByDataCy } = render(<Component />);
    expect(queryByDataCy("move-repo-button")).not.toBeInTheDocument();
    expect(queryByDataCy("attach-repo-button")).toBeInTheDocument();
  });

  it("disables the attach button when the owner field has been changed", () => {
    const { Component } = RenderFakeToastContext(
      <Field
        projectType={ProjectType.Project}
        formData={{ owner: "newOwner", repo: defaultFormData.repo }}
      />
    );
    const { queryByDataCy } = render(<Component />);
    expect(queryByDataCy("attach-repo-button")).toHaveAttribute("disabled");
  });

  it("disables the attach button when the repo field has been changed", () => {
    const { Component } = RenderFakeToastContext(
      <Field
        projectType={ProjectType.Project}
        formData={{ owner: defaultFormData.owner, repo: "newRepo" }}
      />
    );
    const { queryByDataCy } = render(<Component />);
    expect(queryByDataCy("attach-repo-button")).toHaveAttribute("disabled");
  });

  it("shows both buttons for an attached project", () => {
    const { Component } = RenderFakeToastContext(<Field />);
    const { queryByDataCy } = render(<Component />);
    expect(queryByDataCy("move-repo-button")).toBeInTheDocument();
    expect(queryByDataCy("attach-repo-button")).toBeInTheDocument();
  });

  it("does not show either button for project type repo", () => {
    const { Component } = RenderFakeToastContext(
      <Field projectType={ProjectType.Repo} />
    );
    const { queryByDataCy } = render(<Component />);
    expect(queryByDataCy("move-repo-button")).not.toBeInTheDocument();
    expect(queryByDataCy("attach-repo-button")).not.toBeInTheDocument();
  });

  it("clicking the button opens the modal", async () => {
    const { Component } = RenderFakeToastContext(<Field />);
    const { queryByDataCy } = render(<Component />);
    expect(queryByDataCy("move-repo-modal")).not.toBeInTheDocument();

    const moveRepoButton = queryByDataCy("move-repo-button");
    await fireEvent.click(moveRepoButton);
    await waitFor(() => expect(queryByDataCy("move-repo-modal")).toBeVisible());
  });

  describe("moveRepoModal", () => {
    it("renders the Move Repo Modal when the open prop is true", () => {
      const { Component } = RenderFakeToastContext(<MoveModal />);
      const { queryByDataCy } = render(<Component />);
      expect(queryByDataCy("move-repo-modal")).toBeVisible();
    });

    it("does not render the Move Repo Modal when the open prop is false", () => {
      const { Component } = RenderFakeToastContext(<MoveModal open={false} />);
      const { queryByDataCy } = render(<Component />);
      expect(queryByDataCy("move-repo-modal")).not.toBeInTheDocument();
    });

    it("disables the confirm button on initial render", () => {
      const { Component } = RenderFakeToastContext(<MoveModal />);
      const { getByRole } = render(<Component />);

      const moveRepoButton = getByRole("button", { name: "Move Project" });
      expect(moveRepoButton).toHaveAttribute("disabled");
    });

    it("disables the confirm button when only owner field is updated", () => {
      const { Component } = RenderFakeToastContext(<MoveModal />);
      const { getByRole, queryByDataCy } = render(<Component />);
      userEvent.type(queryByDataCy("new-owner-input"), "new-owner-name");

      const moveRepoButton = getByRole("button", { name: "Move Project" });
      expect(moveRepoButton).toHaveAttribute("disabled");
    });

    it("disables the confirm button when only repo field is updated", () => {
      const { Component } = RenderFakeToastContext(<MoveModal />);
      const { getByRole, queryByDataCy } = render(<Component />);
      userEvent.type(queryByDataCy("new-repo-input"), "new-repo-name");

      const moveRepoButton = getByRole("button", { name: "Move Project" });
      expect(moveRepoButton).toHaveAttribute("disabled");
    });

    it("enables the confirm button when both fields are updated", () => {
      const { Component } = RenderFakeToastContext(<MoveModal />);
      const { getByRole, queryByDataCy } = render(<Component />);
      userEvent.type(queryByDataCy("new-owner-input"), "new-owner-name");
      userEvent.type(queryByDataCy("new-repo-input"), "new-repo-name");

      const moveRepoButton = getByRole("button", { name: "Move Project" });
      expect(moveRepoButton).not.toHaveAttribute("disabled");
    });
  });

  describe("attachDetachModal", () => {
    afterEach(() => {
      jest.restoreAllMocks();
    });

    it("clicking the button opens the modal", async () => {
      const { Component } = RenderFakeToastContext(<Field />);
      const { queryByDataCy } = render(<Component />);
      expect(queryByDataCy("attach-repo-modal")).not.toBeInTheDocument();

      const attachRepoButton = queryByDataCy("attach-repo-button");
      fireEvent.click(attachRepoButton);
      await waitFor(() =>
        expect(queryByDataCy("attach-repo-modal")).toBeVisible()
      );
    });

    it("renders the modal when the open prop is true", () => {
      const { Component } = RenderFakeToastContext(<AttachmentModal />);
      const { queryByDataCy } = render(<Component />);
      expect(queryByDataCy("attach-repo-modal")).toBeVisible();
    });

    it("shows the correct modal text when attaching", () => {
      const { Component } = RenderFakeToastContext(<AttachmentModal />);
      const { queryByText } = render(<Component />);
      expect(
        queryByText(
          "Are you sure you want to attach to evergreen-ci/logkeeper?"
        )
      ).toBeVisible();
    });

    it("successfully attaches to repo", async () => {
      const { Component, dispatchToast } = RenderFakeToastContext(
        <AttachmentModal />
      );
      const { queryByText } = render(<Component />);
      fireEvent.click(queryByText("Attach"));
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
      const { queryByText } = render(<Component />);
      expect(
        queryByText(
          "Are you sure you want to detach from evergreen-ci/logkeeper?"
        )
      ).toBeVisible();
    });

    it("successfully detaches from repo", async () => {
      const { Component, dispatchToast } = RenderFakeToastContext(
        <AttachmentModal shouldAttach={false} />
      );
      const { queryByText } = render(<Component />);
      fireEvent.click(queryByText("Detach"));
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
      id: "evergreen",
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
      id: "evergreen",
    },
  },
};
