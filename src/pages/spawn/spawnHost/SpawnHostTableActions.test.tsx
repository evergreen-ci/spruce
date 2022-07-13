import { MockedProvider } from "@apollo/client/testing";
import { GET_USER } from "gql/queries";
import { act, fireEvent, render, screen } from "test_utils";
import { HostStatus } from "types/host";
import { CopySSHCommandButton } from "./SpawnHostTableActions";

const execCommand = jest.fn();
const user = "bynn.lee";
const hostUrl = "ec2-54-242-162-135.compute-1.amazonaws.com";

describe("copySSHCommandButton", () => {
  afterEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
  });
  it("tooltip text should change after clicking on the copy button", async () => {
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
    document.execCommand = execCommand;
    const copySSHButton = screen.queryByDataCy("copy-ssh-button");
    expect(copySSHButton).not.toBeDisabled();

    // MouseEnter should trigger tooltip.
    fireEvent.mouseEnter(copySSHButton);
    act(() => {
      jest.runOnlyPendingTimers();
    });
    expect(screen.getByDataCy("copy-ssh-tooltip")).toBeInTheDocument();
    expect(screen.queryByDataCy("copy-ssh-tooltip")).toBeVisible();
    expect(
      screen.getByText("Must be on VPN to connect to host")
    ).toBeInTheDocument();

    // Click should change tooltip message.
    fireEvent.click(copySSHButton);
    expect(execCommand).toHaveBeenCalledWith("copy");
    expect(screen.getByText("Copied!")).toBeInTheDocument();

    // MouseLeave should cause tooltip to disappear.
    fireEvent.mouseLeave(copySSHButton);
    // Wait for tooltip to disappear and reset the message.
    act(() => {
      jest.runOnlyPendingTimers();
    });
    expect(screen.queryByDataCy("copy-ssh-tooltip")).toBeNull();

    // MouseEnter should trigger tooltip with unchanged message.
    fireEvent.mouseEnter(copySSHButton);
    expect(screen.getByDataCy("copy-ssh-tooltip")).toBeInTheDocument();
    expect(
      screen.getByText("Must be on VPN to connect to host")
    ).toBeInTheDocument();
  });

  it("should disable the Copy SSH Button if there is no host URL", () => {
    render(
      <MockedProvider mocks={[getUserMock]}>
        <CopySSHCommandButton
          user={user}
          hostUrl={undefined}
          hostStatus={HostStatus.Starting}
        />
      </MockedProvider>
    );
    const copySSHButton = screen.queryByDataCy("copy-ssh-button");
    expect(copySSHButton).toBeInTheDocument();
    expect(copySSHButton).toBeDisabled();

    fireEvent.mouseEnter(copySSHButton);
    expect(screen.getByDataCy("copy-ssh-tooltip")).toBeInTheDocument();
    expect(
      screen.getByText("Host must be running in order to SSH")
    ).toBeInTheDocument();
  });

  it("should disable the Copy SSH Button if host is terminated", () => {
    render(
      <MockedProvider mocks={[getUserMock]}>
        <CopySSHCommandButton
          user={user}
          hostUrl={hostUrl}
          hostStatus={HostStatus.Terminated}
        />
      </MockedProvider>
    );
    const copySSHButton = screen.queryByDataCy("copy-ssh-button");
    expect(copySSHButton).toBeInTheDocument();
    expect(copySSHButton).toBeDisabled();

    fireEvent.mouseEnter(copySSHButton);
    expect(screen.getByDataCy("copy-ssh-tooltip")).toBeInTheDocument();
    expect(
      screen.getByText("Host must be running in order to SSH")
    ).toBeInTheDocument();
  });
});

const getUserMock = {
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
