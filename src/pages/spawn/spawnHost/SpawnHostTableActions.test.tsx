import { MockedProvider } from "@apollo/client/testing";
import { SECOND } from "constants/index";
import { getUserMock } from "gql/mocks/getUser";
import { act, render, screen, userEvent, waitFor } from "test_utils";
import { HostStatus } from "types/host";
import { CopySSHCommandButton } from "./SpawnHostTableActions";

const testUser = "bynn.lee";
const hostUrl = "ec2-54-242-162-135.compute-1.amazonaws.com";

describe("copySSHCommandButton", () => {
  afterEach(() => {
    jest.clearAllTimers();
  });

  it("tooltip text should change after clicking on the copy button", async () => {
    jest.useFakeTimers();
    const user = userEvent.setup({
      advanceTimers: jest.advanceTimersByTime,
      writeToClipboard: true,
    });
    render(
      <MockedProvider mocks={[getUserMock]}>
        <CopySSHCommandButton
          user={testUser}
          hostUrl={hostUrl}
          hostStatus={HostStatus.Running}
        />
      </MockedProvider>,
    );

    const copySSHButton = screen.queryByDataCy("copy-ssh-button");

    // Hover over button to trigger tooltip.
    await user.hover(copySSHButton);
    await waitFor(() => {
      expect(screen.getByDataCy("copy-ssh-tooltip")).toBeInTheDocument();
    });
    expect(
      screen.getByText("Must be on VPN to connect to host"),
    ).toBeInTheDocument();

    // Click on button to copy the SSH command and change tooltip message.
    await user.click(copySSHButton);
    const clipboardText = await navigator.clipboard.readText();
    expect(clipboardText).toBe(`ssh ${testUser}@${hostUrl}`);
    expect(screen.getByText("Copied!")).toBeInTheDocument();

    // Advance timer so that the original tooltip text will show.
    act(() => {
      jest.advanceTimersByTime(10 * SECOND);
    });
    expect(
      screen.getByText("Must be on VPN to connect to host"),
    ).toBeInTheDocument();
    jest.useRealTimers();
  });

  it("should disable the Copy SSH Button if there is no host URL", async () => {
    const user = userEvent.setup();
    render(
      <MockedProvider mocks={[getUserMock]}>
        <CopySSHCommandButton
          user={testUser}
          hostUrl={undefined}
          hostStatus={HostStatus.Starting}
        />
      </MockedProvider>,
    );
    const copySSHButton = screen.queryByDataCy("copy-ssh-button");
    expect(copySSHButton).toBeInTheDocument();
    expect(copySSHButton).toHaveAttribute("aria-disabled", "true");

    await user.hover(copySSHButton);
    await waitFor(() => {
      expect(screen.getByDataCy("copy-ssh-tooltip")).toBeInTheDocument();
    });
    expect(
      screen.getByText("Host must be running in order to SSH"),
    ).toBeInTheDocument();
  });

  it("should disable the Copy SSH Button if host is terminated", async () => {
    const user = userEvent.setup();
    render(
      <MockedProvider mocks={[getUserMock]}>
        <CopySSHCommandButton
          user={testUser}
          hostUrl={hostUrl}
          hostStatus={HostStatus.Terminated}
        />
      </MockedProvider>,
    );
    const copySSHButton = screen.queryByDataCy("copy-ssh-button");
    expect(copySSHButton).toBeInTheDocument();
    expect(copySSHButton).toHaveAttribute("aria-disabled", "true");

    await user.hover(copySSHButton);
    await waitFor(() => {
      expect(screen.getByDataCy("copy-ssh-tooltip")).toBeInTheDocument();
    });
    expect(
      screen.getByText("Host must be running in order to SSH"),
    ).toBeInTheDocument();
  });
});
