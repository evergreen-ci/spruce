import { MockedProvider } from "@apollo/client/testing";
import { RenderFakeToastContext } from "context/toast/__mocks__";
import { MyHostsQuery, MyHostsQueryVariables } from "gql/generated/types";
import { getSpruceConfigMock } from "gql/mocks/getSpruceConfig";
import { GET_MY_HOSTS } from "gql/queries";
import { renderWithRouterMatch as render, screen, waitFor } from "test_utils";
import { ApolloMock } from "types/gql";
import { HostStatus } from "types/host";
import { MyHost } from "types/spawn";
import { SpawnHostButton } from "./SpawnHostButton";

describe("spawnHostButton", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });
  it("disables the spawn host button when the number of hosts that currently exist are greater than or equal to the max number of spawn hosts per user", async () => {
    const { Component } = RenderFakeToastContext(<SpawnHostButton />);
    render(
      <MockedProvider mocks={[sixHostsMock, getSpruceConfigMock]}>
        <Component />
      </MockedProvider>
    );
    await waitFor(() => {
      const spawnButton = screen.getByRole("button", {
        name: "Spawn a host",
      });
      expect(spawnButton).toHaveAttribute("aria-disabled", "true");
    });
  });

  it("enables the spawn host button when the number of hosts that currently exist is less than the max number of spawn hosts per user", async () => {
    const { Component } = RenderFakeToastContext(<SpawnHostButton />);
    render(
      <MockedProvider mocks={[twoHostsMock, getSpruceConfigMock]}>
        <Component />
      </MockedProvider>
    );
    await waitFor(() => {
      const spawnButton = screen.getByRole("button", {
        name: "Spawn a host",
      });
      expect(spawnButton).toHaveAttribute("aria-disabled", "false");
    });
  });

  it("does not count terminated hosts against the total host count", async () => {
    const { Component } = RenderFakeToastContext(<SpawnHostButton />);
    render(
      <MockedProvider
        mocks={[fiveHostsWithTerminatedMock, getSpruceConfigMock]}
      >
        <Component />
      </MockedProvider>
    );
    await waitFor(() => {
      const spawnButton = screen.getByRole("button", {
        name: "Spawn a host",
      });
      expect(spawnButton).toHaveAttribute("aria-disabled", "false");
    });
  });
});

const baseSpawnHost: Omit<MyHost, "id" | "status"> = {
  __typename: "Host",
  availabilityZone: "us-east-1c",
  displayName: "",
  distro: {
    __typename: "DistroInfo",
    id: "ubuntu1804-workstation",
    isVirtualWorkStation: true,
    isWindows: false,
    user: "ubuntu",
    workDir: "/home/ubuntu",
  },
  expiration: new Date("2021-10-28T22:37:40Z"),
  homeVolume: {
    displayName: "",
    id: "home-volume-id",
  },
  homeVolumeID: "vol-07fa9f6b5c2067e34",
  hostUrl: "ec2-34-201-138-106.compute-1.amazonaws.com",
  instanceTags: [],
  instanceType: "m5.xlarge",
  noExpiration: false,
  provider: "ec2-ondemand",
  startedBy: "stssss.arst",
  tag: "evg-ubuntu1804-workstation-20201014223740-6478743249380995507",
  uptime: new Date("2020-10-14T22:37:40Z"),
  user: "ubuntu",
  volumes: [
    {
      __typename: "Volume",
      displayName: "",
      id: "vol-0cf616375140c067e",
      migrating: false,
    },
  ],
};

const spawnHost1: MyHost = {
  ...baseSpawnHost,
  id: "i-00b212e96b3f91079",
  status: HostStatus.Running,
};

const spawnHost2: MyHost = {
  ...baseSpawnHost,
  id: "i-00b212e96b3f91080",
  status: HostStatus.Running,
};

const spawnHost3: MyHost = {
  ...baseSpawnHost,
  id: "i-00b212e96b3f91081",
  status: HostStatus.Stopped,
};

const spawnHost4: MyHost = {
  ...baseSpawnHost,
  id: "i-00b212e96b3f91082",
  status: HostStatus.Starting,
};

const spawnHost5: MyHost = {
  ...baseSpawnHost,
  id: "i-00b212e96b3f91083",
  status: HostStatus.Provisioning,
};

const spawnHost6: MyHost = {
  ...baseSpawnHost,
  id: "i-00b212e96b3f91084",
  status: HostStatus.Running,
};

const terminatedHost: MyHost = {
  ...baseSpawnHost,
  id: "i-00b212e96b3f91085",
  status: HostStatus.Terminated,
};

const sixHostsMock: ApolloMock<MyHostsQuery, MyHostsQueryVariables> = {
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

const twoHostsMock: ApolloMock<MyHostsQuery, MyHostsQueryVariables> = {
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

const fiveHostsWithTerminatedMock: ApolloMock<
  MyHostsQuery,
  MyHostsQueryVariables
> = {
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
