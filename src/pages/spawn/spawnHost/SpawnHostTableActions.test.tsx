import { MockedProvider } from "@apollo/client/testing";
import { GetUserQuery, GetUserQueryVariables } from "gql/generated/types";
import { GET_USER } from "gql/queries";
import { act, render, screen, userEvent, waitFor } from "test_utils";
import { ApolloMock } from "types/gql";
import { HostStatus } from "types/host";
import { CopySSHCommandButton } from "./SpawnHostTableActions";

const user = "bynn.lee";
const hostUrl = "ec2-54-242-162-135.compute-1.amazonaws.com";

describe("copySSHCommandButton", () => {
  afterEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  it("tooltip text should change after clicking on the copy button", async () => {
    Object.defineProperty(navigator, "clipboard", {
      value: {
        writeText: jest.fn(),
      },
    });
    render(
      <MockedProvider mocks={[getUserMock]}>
        <CopySSHCommandButton
          user={user}
          hostUrl={hostUrl}
          hostStatus={HostStatus.Running}
        />
      </MockedProvider>
    );
    jest.useFakeTimers();
    const copySSHButton = screen.queryByDataCy("copy-ssh-button");

    // Hover over button to trigger tooltip.
    userEvent.hover(copySSHButton);
    await waitFor(() => {
      expect(screen.getByDataCy("copy-ssh-tooltip")).toBeInTheDocument();
    });
    expect(
      screen.getByText("Must be on VPN to connect to host")
    ).toBeInTheDocument();
    act(() => {
      jest.runOnlyPendingTimers();
    });

    // Click on button to copy the SSH command and change tooltip message.
    userEvent.click(copySSHButton);
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
      `ssh ${user}@${hostUrl}`
    );
    expect(screen.getByText("Copied!")).toBeInTheDocument();

    // Wait for tooltip to disappear and reset the message.
    userEvent.unhover(copySSHButton);
    await waitFor(() => {
      expect(screen.queryByDataCy("copy-ssh-tooltip")).toBeNull();
    });
    act(() => {
      jest.runAllTimers();
    });

    // Hover on button to see tooltip with original message.
    userEvent.hover(copySSHButton);
    await waitFor(() => {
      expect(screen.getByDataCy("copy-ssh-tooltip")).toBeInTheDocument();
    });
    expect(
      screen.getByText("Must be on VPN to connect to host")
    ).toBeInTheDocument();
  });

  it("should disable the Copy SSH Button if there is no host URL", async () => {
    render(
      <MockedProvider mocks={[getUserMock]}>
        <CopySSHCommandButton
          user={user}
          hostUrl={undefined}
          hostStatus={HostStatus.Starting}
        />
      </MockedProvider>
    );
    const copySSHButtonWrapper = screen.queryByDataCy(
      "copy-ssh-button-wrapper"
    );
    const copySSHButton = screen.queryByDataCy("copy-ssh-button");
    expect(copySSHButton).toBeInTheDocument();
    expect(copySSHButton).toBeDisabled();

    userEvent.hover(copySSHButtonWrapper);
    await waitFor(() => {
      expect(screen.getByDataCy("copy-ssh-tooltip")).toBeInTheDocument();
    });
    expect(
      screen.getByText("Host must be running in order to SSH")
    ).toBeInTheDocument();
  });

  it("should disable the Copy SSH Button if host is terminated", async () => {
    render(
      <MockedProvider mocks={[getUserMock]}>
        <CopySSHCommandButton
          user={user}
          hostUrl={hostUrl}
          hostStatus={HostStatus.Terminated}
        />
      </MockedProvider>
    );
    const copySSHButtonWrapper = screen.queryByDataCy(
      "copy-ssh-button-wrapper"
    );
    const copySSHButton = screen.queryByDataCy("copy-ssh-button");
    expect(copySSHButton).toBeInTheDocument();
    expect(copySSHButton).toBeDisabled();

    userEvent.hover(copySSHButtonWrapper);
    await waitFor(() => {
      expect(screen.getByDataCy("copy-ssh-tooltip")).toBeInTheDocument();
    });
    expect(
      screen.getByText("Host must be running in order to SSH")
    ).toBeInTheDocument();
  });
});

const getUserMock: ApolloMock<GetUserQuery, GetUserQueryVariables> = {
  request: {
    query: GET_USER,
    variables: {},
  },
  result: {
    data: {
      user: {
        userId: "a",
        displayName: "A",
        emailAddress: "a@a.com",
      },
    },
  },
};
