import { MockedProvider } from "@apollo/client/testing";
import userEvent from "@testing-library/user-event";
import { RenderFakeToastContext } from "context/__mocks__/toast";
import {
  ATTACH_PROJECT_TO_REPO,
  DETACH_PROJECT_FROM_REPO,
} from "gql/mutations";
import { render, fireEvent, waitFor } from "test_utils";
import { ProjectVariant } from "../../utils";
import {
  AttachDetachModal,
  MoveRepoModal,
  RepoConfigField,
} from "./RepoConfigField";
import { defaultFieldProps } from "./utils";

const fieldProps = {
  ...defaultFieldProps,
  formData: {
    owner: "evergreen-ci",
    repo: "logkeeper",
  },
};

const Field = () => (
  <MockedProvider mocks={[attachProjectToRepoMock, detachProjectFromRepoMock]}>
    <RepoConfigField
      {...fieldProps}
      uiSchema={{
        options: {
          projectId: "evergreen",
          repoName: "evergreen",
          repoOwner: "evergreen-ci",
          projectVariant: ProjectVariant.AttachedProject,
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
      repoName={fieldProps.formData.repo}
      repoOwner={fieldProps.formData.owner}
      shouldAttach={shouldAttach}
    />
  </MockedProvider>
);

describe("repoConfigField", () => {
  it("does not show the move repo button when not attached to repo", async () => {
    const { queryByDataCy } = render(
      <RepoConfigField
        {...fieldProps}
        uiSchema={{
          options: { projectVariant: ProjectVariant.Project },
        }}
      />
    );
    expect(queryByDataCy("move-repo-button")).not.toBeInTheDocument();
  });

  it("clicking the button opens the modal", async () => {
    const { queryByDataCy } = render(
      <RepoConfigField
        {...fieldProps}
        uiSchema={{
          options: { projectVariant: ProjectVariant.AttachedProject },
        }}
      />
    );
    expect(queryByDataCy("move-repo-modal")).not.toBeInTheDocument();

    const moveRepoButton = queryByDataCy("move-repo-button");
    await fireEvent.click(moveRepoButton);
    await waitFor(() => expect(queryByDataCy("move-repo-modal")).toBeVisible());
  });

  describe("moveRepoModal", () => {
    it("renders the Move Repo Modal when the open prop is true", () => {
      const mockOnConfirm = jest.fn();
      const mockOnCancel = jest.fn();
      const { queryByDataCy } = render(
        <MoveRepoModal onCancel={mockOnCancel} onConfirm={mockOnConfirm} open />
      );
      expect(queryByDataCy("move-repo-modal")).toBeVisible();
    });

    it("does not render the Move Repo Modal when the open prop is false", () => {
      const mockOnConfirm = jest.fn();
      const mockOnCancel = jest.fn();
      const { queryByDataCy } = render(
        <MoveRepoModal
          onCancel={mockOnCancel}
          onConfirm={mockOnConfirm}
          open={false}
        />
      );
      expect(queryByDataCy("move-repo-modal")).not.toBeInTheDocument();
    });

    it("disables the confirm button on initial render", () => {
      const mockOnConfirm = jest.fn();
      const mockOnCancel = jest.fn();
      const { getByRole } = render(
        <MoveRepoModal onCancel={mockOnCancel} onConfirm={mockOnConfirm} open />
      );

      const moveRepoButton = getByRole("button", { name: "Move Repo" });
      expect(moveRepoButton).toHaveAttribute("disabled");
    });

    it("disables the confirm button when only owner field is updated", () => {
      const mockOnConfirm = jest.fn();
      const mockOnCancel = jest.fn();
      const { getByRole, queryByDataCy } = render(
        <MoveRepoModal onCancel={mockOnCancel} onConfirm={mockOnConfirm} open />
      );
      userEvent.type(queryByDataCy("new-owner-input"), "new-owner-name");

      const moveRepoButton = getByRole("button", { name: "Move Repo" });
      expect(moveRepoButton).toHaveAttribute("disabled");
    });

    it("disables the confirm button when only repo field is updated", () => {
      const mockOnConfirm = jest.fn();
      const mockOnCancel = jest.fn();
      const { getByRole, queryByDataCy } = render(
        <MoveRepoModal onCancel={mockOnCancel} onConfirm={mockOnConfirm} open />
      );
      userEvent.type(queryByDataCy("new-repo-input"), "new-repo-name");

      const moveRepoButton = getByRole("button", { name: "Move Repo" });
      expect(moveRepoButton).toHaveAttribute("disabled");
    });

    it("enables the confirm button when both fields are updated", () => {
      const mockOnConfirm = jest.fn();
      const mockOnCancel = jest.fn();
      const { getByRole, queryByDataCy } = render(
        <MoveRepoModal onCancel={mockOnCancel} onConfirm={mockOnConfirm} open />
      );
      userEvent.type(queryByDataCy("new-owner-input"), "new-owner-name");
      userEvent.type(queryByDataCy("new-repo-input"), "new-repo-name");

      const moveRepoButton = getByRole("button", { name: "Move Repo" });
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
