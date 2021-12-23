import { MockedProvider } from "@apollo/client/testing";
import { RenderFakeToastContext } from "context/__mocks__/toast";
import { getSpruceConfigMock } from "gql/mocks/getSpruceConfig";
import {
  GET_AWS_REGIONS,
  GET_DISTROS,
  GET_MY_HOSTS,
  GET_MY_PUBLIC_KEYS,
  GET_MY_VOLUMES,
  GET_USER,
} from "gql/queries";
import { renderWithRouterMatch as render, waitFor } from "test_utils";
import { SpawnHostButton } from "./SpawnHostButton";

describe("spawnHostButton", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });
  it("disables the spawn host button when the number of hosts that currently exist are greater than or equal to the max number of spawn hosts per user", async () => {
    const { Component } = RenderFakeToastContext(
      <MockedProvider
        mocks={[
          awsRegionsMock,
          getDistrosMock,
          getMyPublicKeysMock,
          getUserMock,
          myVolumesQueryMock,
          twoHostsTwoLimitMock,
          getSpruceConfigMock,
        ]}
      >
        <SpawnHostButton />
      </MockedProvider>
    );
    const { queryByDataCy } = render(Component);
    await waitFor(() =>
      expect(queryByDataCy("spawn-host-button")).toBeDisabled()
    );
  });

  it("enables the spawn host button when the number of hosts that currently exist is less than the max number of spawn hosts per user", async () => {
    const MockedSpawnHostButton = () => (
      <MockedProvider
        mocks={[
          awsRegionsMock,
          getDistrosMock,
          getMyPublicKeysMock,
          getUserMock,
          myVolumesQueryMock,
          twoHostsThreeLimitMock,
          getSpruceConfigMock,
        ]}
      >
        <SpawnHostButton />
      </MockedProvider>
    );
    const { Component } = RenderFakeToastContext(<MockedSpawnHostButton />);
    const { queryByDataCy } = render(Component);
    await waitFor(() =>
      expect(queryByDataCy("spawn-host-button")).not.toBeDisabled()
    );
  });
});

const awsRegionsMock = {
  request: {
    query: GET_AWS_REGIONS,
    variables: {},
  },
  result: {
    data: {
      awsRegions: ["us-east-1", "us-west-1", "eu-west-1", "ap-southeast-2"],
    },
  },
};

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

const getMyPublicKeysMock = {
  request: {
    query: GET_MY_PUBLIC_KEYS,
    variables: {},
  },
  result: {
    data: {
      myPublicKeys: [],
    },
  },
};

const getDistrosMock = {
  request: {
    query: GET_DISTROS,
    variables: { onlySpawnable: true },
  },
  result: {
    data: {
      distros: [
        {
          name: "windows-32",
          isVirtualWorkStation: false,
          __typename: "Distro",
        },
      ],
    },
  },
};
const myVolumesQueryMock = {
  request: { query: GET_MY_VOLUMES, variables: {} },
  result: {
    data: {
      myVolumes: [],
    },
  },
};

const twoHostsTwoLimitMock = {
  request: {
    query: GET_MY_HOSTS,
    variables: {},
  },
  result: {
    data: {
      myHosts: [
        {
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
          id: "i-00b212e96b3f91079",
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
          status: "running",
          startedBy: "arjun.patel",
          tag: "evg-ubuntu1804-workstation-20201014223740-6478743249380995507",
          user: "ubuntu",
          uptime: "2020-10-14T22:37:40Z",
          displayName: "",
          availabilityZone: "us-east-1c",
          __typename: "Host",
        },
        {
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
          id: "i-00b212e96b3f91079",
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
          status: "running",
          startedBy: "arjun.patel",
          tag: "evg-ubuntu1804-workstation-20201014223740-6478743249380995507",
          user: "ubuntu",
          uptime: "2020-10-14T22:37:40Z",
          displayName: "",
          availabilityZone: "us-east-1c",
          __typename: "Host",
        },
      ],
    },
  },
};
const twoHostsThreeLimitMock = {
  request: {
    query: GET_MY_HOSTS,
    variables: {},
  },
  result: {
    data: {
      myHosts: [
        {
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
          id: "i-00b212e96b3f91079",
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
          status: "running",
          startedBy: "arjun.patel",
          tag: "evg-ubuntu1804-workstation-20201014223740-6478743249380995507",
          user: "ubuntu",
          uptime: "2020-10-14T22:37:40Z",
          displayName: "",
          availabilityZone: "us-east-1c",
          __typename: "Host",
        },
        {
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
          id: "i-00b212e96b3f91079",
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
          status: "running",
          startedBy: "arjun.patel",
          tag: "evg-ubuntu1804-workstation-20201014223740-6478743249380995507",
          user: "ubuntu",
          uptime: "2020-10-14T22:37:40Z",
          displayName: "",
          availabilityZone: "us-east-1c",
          __typename: "Host",
        },
      ],
    },
  },
};
