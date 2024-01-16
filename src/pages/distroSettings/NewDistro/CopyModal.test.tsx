import { MockedProvider, MockedResponse } from "@apollo/client/testing";
import { GraphQLError } from "graphql";
import { RenderFakeToastContext } from "context/toast/__mocks__";
import {
  CopyDistroMutation,
  CopyDistroMutationVariables,
} from "gql/generated/types";
import { COPY_DISTRO } from "gql/mutations";
import {
  renderWithRouterMatch as render,
  screen,
  userEvent,
  waitFor,
} from "test_utils";
import { ApolloMock } from "types/gql";
import { CopyModal } from "./CopyModal";

const distroIdToCopy = "rhel71-power8-large";
const newDistroId = "copied-distro";

const Modal = ({
  copyMock = copyDistroMock,
  open = true,
}: {
  copyMock?: MockedResponse;
  open?: boolean;
}) => (
  <MockedProvider mocks={[copyMock]}>
    <CopyModal handleClose={() => {}} open={open} />
  </MockedProvider>
);

describe("copy distro modal", () => {
  it("does not render the modal when open prop is false", () => {
    const { Component } = RenderFakeToastContext(<Modal open={false} />);
    render(<Component />, {
      path: `/distro/:distroId/settings/general`,
      route: `/distro/${distroIdToCopy}/settings/general`,
    });

    expect(screen.queryByDataCy("copy-distro-modal")).not.toBeInTheDocument();
  });

  it("disables the confirm button on initial render and uses the provided label", () => {
    const { Component } = RenderFakeToastContext(<Modal />);
    render(<Component />, {
      path: `/distro/:distroId/settings/general`,
      route: `/distro/${distroIdToCopy}/settings/general`,
    });

    expect(screen.getByDataCy("copy-distro-modal")).toBeVisible();
    expect(screen.queryByText(`Duplicate “${distroIdToCopy}”`)).toBeVisible();

    const confirmButton = screen.getByRole("button", {
      name: "Duplicate",
    });
    expect(confirmButton).toHaveAttribute("aria-disabled", "true");
  });

  it("submits the modal when a distro name is provided", async () => {
    const user = userEvent.setup();
    const { Component, dispatchToast } = RenderFakeToastContext(<Modal />);
    const { router } = render(<Component />, {
      path: `/distro/:distroId/settings/general`,
      route: `/distro/${distroIdToCopy}/settings/general`,
    });

    await user.type(screen.queryByDataCy("distro-id-input"), newDistroId);
    await user.click(screen.getByRole("button", { name: "Duplicate" }));
    await waitFor(() => expect(dispatchToast.success).toHaveBeenCalledTimes(1));
    await waitFor(() => expect(dispatchToast.warning).toHaveBeenCalledTimes(0));
    await waitFor(() => expect(dispatchToast.error).toHaveBeenCalledTimes(0));
    expect(router.state.location.pathname).toBe(
      `/distro/${newDistroId}/settings/general`,
    );
  });

  it("disables the duplicate button when project name contains a space", async () => {
    const user = userEvent.setup();
    const { Component } = RenderFakeToastContext(<Modal />);
    render(<Component />, {
      path: `/distro/:distroId/settings/general`,
      route: `/distro/${distroIdToCopy}/settings/general`,
    });

    await user.type(
      screen.queryByDataCy("distro-id-input"),
      "string with spaces",
    );
    expect(
      screen.getByRole("button", {
        name: "Duplicate",
      }),
    ).toHaveAttribute("aria-disabled", "true");
  });

  it("shows an error toast when an error is returned", async () => {
    const mockWithError: ApolloMock<
      CopyDistroMutation,
      CopyDistroMutationVariables
    > = {
      request: {
        query: COPY_DISTRO,
        variables: {
          opts: {
            distroIdToCopy,
            newDistroId,
          },
        },
      },
      result: {
        errors: [new GraphQLError("There was an error copying the distro")],
      },
    };
    const user = userEvent.setup();
    const { Component, dispatchToast } = RenderFakeToastContext(
      <Modal copyMock={mockWithError} />,
    );
    const { router } = render(<Component />, {
      path: `/distro/:distroId/settings/general`,
      route: `/distro/${distroIdToCopy}/settings/general`,
    });

    await user.type(screen.queryByDataCy("distro-id-input"), newDistroId);

    const confirmButton = screen.getByRole("button", {
      name: "Duplicate",
    });
    expect(confirmButton).toBeEnabled();

    await user.click(confirmButton);
    await waitFor(() => expect(dispatchToast.success).toHaveBeenCalledTimes(0));
    await waitFor(() => expect(dispatchToast.warning).toHaveBeenCalledTimes(0));
    await waitFor(() => expect(dispatchToast.error).toHaveBeenCalledTimes(1));
    expect(router.state.location.pathname).toBe(
      `/distro/${distroIdToCopy}/settings/general`,
    );
  });
});

const copyDistroMock: ApolloMock<
  CopyDistroMutation,
  CopyDistroMutationVariables
> = {
  request: {
    query: COPY_DISTRO,
    variables: {
      opts: {
        distroIdToCopy,
        newDistroId,
      },
    },
  },
  result: {
    data: {
      copyDistro: {
        __typename: "NewDistroPayload",
        newDistroId,
      },
    },
  },
};
