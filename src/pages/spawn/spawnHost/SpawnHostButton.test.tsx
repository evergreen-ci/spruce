import { MockedProvider } from "@apollo/client/testing";
import { RenderFakeToastContext } from "context/__mocks__/toast";
import { getSpruceConfigMock } from "gql/mocks/getSpruceConfig";
import { GET_MY_HOSTS } from "gql/queries";
import { renderWithRouterMatch as render, act } from "test_utils";
import { HostStatus } from "types/host";
import { SpawnHostButton } from "./SpawnHostButton";

describe("spawnHostButton", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });
  it("disables the spawn host button when the number of hosts that currently exist are greater than or equal to the max number of spawn hosts per user", async () => {
    const { Component } = RenderFakeToastContext(<SpawnHostButton />);
    const { getByText } = render(
      <MockedProvider mocks={[sixHostsMock, getSpruceConfigMock]}>
        <Component />
      </MockedProvider>
    );
    await act(() => new Promise((resolve) => setTimeout(resolve, 0)));
    const spawnButton = getByText("Spawn a host").closest("button");
    expect(spawnButton).toHaveAttribute("aria-disabled", "true");
  });

  it("enables the spawn host button when the number of hosts that currently exist is less than the max number of spawn hosts per user", async () => {
    const { Component } = RenderFakeToastContext(<SpawnHostButton />);
    const { getByText } = render(
      <MockedProvider mocks={[twoHostsMock, getSpruceConfigMock]}>
        <Component />
      </MockedProvider>
    );
    await act(() => new Promise((resolve) => setTimeout(resolve, 0)));
    const spawnButton = getByText("Spawn a host").closest("button");
    expect(spawnButton).toHaveAttribute("aria-disabled", "false");
  });

  it("does not count terminated hosts against the total host count", async () => {
    const { Component } = RenderFakeToastContext(<SpawnHostButton />);
    const { getByText } = render(
      <MockedProvider
        mocks={[fiveHostsWithTerminatedMock, getSpruceConfigMock]}
      >
        <Component />
      </MockedProvider>
    );
    await act(() => new Promise((resolve) => setTimeout(resolve, 0)));
    const spawnButton = getByText("Spawn a host").closest("button");
    expect(spawnButton).toHaveAttribute("aria-disabled", "false");
  });
});

const baseSpawnHost = {
  expiration: "2021-10-28T22:37:40Z",
  distro: {
    isVirtualWorkStation: true,
    id: "ubuntu1804-workstation",
    user: "ubuntu",
    workDir: "/home/ubuntu",
    isWindows: false,
    __typename: "DistroInfo",
  },
  hostUrl: "ec2-34-201-138-106.compute-1.amazonaws.com",
  homeVolumeID: "vol-07fa9f6b5c2067e34",
  homeVolume: {
    displayName: "",
  },

  instanceType: "m5.xlarge",
  instanceTags: [],
  volumes: [
    {
      displayName: "",
      id: "vol-0cf616375140c067e",
      __typename: "Volume",
    },
  ],
  noExpiration: false,
  provider: "ec2-ondemand",
  startedBy: "arjun.patel",
  tag: "evg-ubuntu1804-workstation-20201014223740-6478743249380995507",
  user: "ubuntu",
  uptime: "2020-10-14T22:37:40Z",
  displayName: "",
  availabilityZone: "us-east-1c",
  __typename: "Host",
};

const spawnHost1 = {
  ...baseSpawnHost,
  id: "i-00b212e96b3f91079",
  status: HostStatus.Running,
};

const spawnHost2 = {
  ...baseSpawnHost,
  id: "i-00b212e96b3f91080",
  status: HostStatus.Running,
};

const spawnHost3 = {
  ...baseSpawnHost,
  id: "i-00b212e96b3f91081",
  status: HostStatus.Stopped,
};

const spawnHost4 = {
  ...baseSpawnHost,
  id: "i-00b212e96b3f91082",
  status: HostStatus.Starting,
};

const spawnHost5 = {
  ...baseSpawnHost,
  id: "i-00b212e96b3f91083",
  status: HostStatus.Provisioning,
};

const spawnHost6 = {
  ...baseSpawnHost,
  id: "i-00b212e96b3f91084",
  status: HostStatus.Running,
};

const terminatedHost = {
  ...baseSpawnHost,
  id: "i-00b212e96b3f91085",
  status: HostStatus.Terminated,
};

const sixHostsMock = {
  request: {
    query: GET_MY_HOSTS,
    variables: {},
  },
  result: {
    data: {
      myHosts: [
        spawnHost1,
        spawnHost2,
        spawnHost3,
        spawnHost4,
        spawnHost5,
        spawnHost6,
      ],
    },
  },
};

const twoHostsMock = {
  request: {
    query: GET_MY_HOSTS,
    variables: {},
  },
  result: {
    data: {
      myHosts: [spawnHost1, spawnHost2],
    },
  },
};

const fiveHostsWithTerminatedMock = {
  request: {
    query: GET_MY_HOSTS,
    variables: {},
  },
  result: {
    data: {
      myHosts: [
        spawnHost1,
        spawnHost2,
        spawnHost3,
        spawnHost4,
        spawnHost5,
        terminatedHost,
      ],
    },
  },
};
