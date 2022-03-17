import { MockedProvider } from "@apollo/client/testing";
import { GET_USER } from "gql/queries";
import { act, fireEvent, render } from "test_utils";
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
    const { queryByDataCy, queryByText } = render(
      <MockedProvider mocks={[getUserMock]}>
        <CopySSHCommandButton
          user={user}
          hostUrl={hostUrl}
          hostStatus="running"
        />
      </MockedProvider>
    );
    await act(() => new Promise((resolve) => setTimeout(resolve, 0)));
    jest.useFakeTimers();
    document.execCommand = execCommand;
    const copySshButton = queryByDataCy("copy-ssh-button");

    // MouseEnter should trigger tooltip.
    fireEvent.mouseEnter(copySshButton);
    act(() => {
      jest.runOnlyPendingTimers();
    });
    expect(queryByDataCy("copy-ssh-tooltip")).toBeInTheDocument();
    expect(queryByDataCy("copy-ssh-tooltip")).toBeVisible();
    expect(
      queryByText("Must be on VPN to connect to host")
    ).toBeInTheDocument();

    // Click should change tooltip message.
    fireEvent.click(copySshButton);
    expect(execCommand).toHaveBeenCalledWith("copy");
    expect(queryByText("Copied!")).toBeInTheDocument();

    // MouseLeave should cause tooltip to disappear.
    fireEvent.mouseLeave(copySshButton);
    // Wait for tooltip to disappear and reset the message.
    act(() => {
      jest.runOnlyPendingTimers();
    });
    expect(queryByDataCy("copy-ssh-tooltip")).toBeNull();

    // MouseEnter should trigger tooltip with unchanged message.
    fireEvent.mouseEnter(copySshButton);
    expect(queryByDataCy("copy-ssh-tooltip")).toBeInTheDocument();
    expect(
      queryByText("Must be on VPN to connect to host")
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
        __typename: "User",
      },
    },
  },
};
