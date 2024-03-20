import { MockedProvider } from "@apollo/client/testing";
import {
  MyHostsQuery,
  MyHostsQueryVariables,
  MyVolumesQuery,
  MyVolumesQueryVariables,
} from "gql/generated/types";
import { getSpruceConfigMock } from "gql/mocks/getSpruceConfig";
import { MY_VOLUMES, MY_HOSTS } from "gql/queries";
import { renderHook } from "test_utils";
import { ApolloMock } from "types/gql";
import { useDisableSpawnExpirationCheckbox } from "..";

const getProvider = (mocks) => {
  const mockedProvider = ({ children }) => (
    <MockedProvider mocks={mocks}>{children}</MockedProvider>
  );
  return mockedProvider;
};

describe("useDisableSpawnExpirationCheckbox", () => {
  it("should return true when the user already has the maximum unexpirable volumes and a target item is not supplied.", async () => {
    const { result } = renderHook(
      () => useDisableSpawnExpirationCheckbox(true),
      {
        wrapper: getProvider(mocks),
      },
    );
    expect(result.current).toBeTruthy();
  });

  it("should return false when when the user has the maximum number of unexpirable volumes and the target item is unexpirable.", async () => {
    const { result } = renderHook(
      () =>
        useDisableSpawnExpirationCheckbox(true, {
          ...volume,
          noExpiration: true,
        }),
      { wrapper: getProvider(mocks) },
    );
    expect(result.current).toBeFalsy();
  });

  it("should return true when the user has the maximum number of unexpirable volumes and the target item is expirable.", async () => {
    const { result } = renderHook(
      () =>
        useDisableSpawnExpirationCheckbox(true, {
          ...volume,
          noExpiration: false,
        }),
      {
        wrapper: getProvider(mocks),
      },
    );
    expect(result.current).toBeTruthy();
  });

  it("should return true when the user has the maximum number of hosts and a target item is not supplied.", async () => {
    const { result } = renderHook(
      () => useDisableSpawnExpirationCheckbox(false),
      { wrapper: getProvider(mocks) },
    );
    expect(result.current).toBeTruthy();
  });

  it("should return false when when user has the maximum number of unexpirable hosts and the target item is unexpirable.", async () => {
    const { result } = renderHook(
      () =>
        useDisableSpawnExpirationCheckbox(false, {
          ...host,
          noExpiration: true,
        }),
      {
        wrapper: getProvider(mocks),
      },
    );
    expect(result.current).toBeFalsy();
  });

  it("should return false when when user has the maximum number of unexpirable hosts and the target item is expirable.", async () => {
    const { result } = renderHook(
      () =>
        useDisableSpawnExpirationCheckbox(false, {
          ...host,
          noExpiration: false,
        }),
      {
        wrapper: getProvider(mocks),
      },
    );
    expect(result.current).toBeTruthy();
  });
});

const myVolumesBase: Omit<
  MyVolumesQuery["myVolumes"][0],
  "noExpiration" | "id"
> = {
  displayName: "",
  createdBy: "arjrsatun.psratatel",
  type: "gp2",
  availabilityZone: "us-east-1d",
  size: 200,
  expiration: new Date("2020-11-12T18:19:39Z"),
  deviceName: null,
  hostID: "i-0d5d29bf2e7ee342d",
  host: {
    displayName: "hai",
    id: "i-0d5d29bf2e7ee342d",
    noExpiration: false,
    __typename: "Host",
  },
  homeVolume: false,
  creationTime: new Date("2020-11-05T18:19:39Z"),
  migrating: false,
};
const myVolumesQueryMock: ApolloMock<MyVolumesQuery, MyVolumesQueryVariables> =
  {
    request: { query: MY_VOLUMES, variables: {} },
    result: {
      data: {
        myVolumes: [
          {
            ...myVolumesBase,
            noExpiration: false,
            id: "vol-0a7fa1af4c970e824",
            __typename: "Volume",
          },
          {
            ...myVolumesBase,
            noExpiration: false,
            id: "vol-0270933468cf4712a",
            __typename: "Volume",
          },
          {
            ...myVolumesBase,
            noExpiration: true,
            id: "vol-04f4e0b9c13b4d0ad",
            __typename: "Volume",
          },
          {
            ...myVolumesBase,
            noExpiration: true,
            id: "vol-094dab1409b72c64a",
            __typename: "Volume",
          },
        ],
      },
    },
  };

const host = {
  expiration: new Date("2020-08-21T14:00:07-04:00"),
  noExpiration: false,
  distro: {
    isVirtualWorkStation: true,
    id: "ubuntu1804-workstation",
    user: "ubuntu",
    workDir: "/home/ubuntu",
  },
  hostUrl: "ec2-54-242-162-135.compute-1.amazonaws.com",
  homeVolumeID: "vol-0ea662ac92f611ed4",
  id: "i-04ade558e1e26b0ad",
  instanceType: "m5.xlarge",
  instanceTags: [],
  volumes: [
    {
      displayName: "",
      id: "vol-0583d66433a69f136",
      migrating: false,
      __typename: "Volume",
    },
    {
      displayName: "",
      id: "vol-0ea662ac92f611ed4",
      migrating: false,
      __typename: "Volume",
    },
  ],
  provider: "ec2-ondemand",
  status: "running",
  startedBy: "admin",
  tag: "evg-ubuntu1804-workstation-20200615111044-7227428564029203",
  user: "ubuntu",
  uptime: new Date("2020-06-15T07:10:44-04:00"),
  displayName: "",
  availabilityZone: "us-east-1a",
};

const volume = {
  id: "705cbc9010f090b600639e7223a21e68fe35508a12d8c63a34662d01ddf13302",
  displayName:
    "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b857",
  createdBy: "admin",
  type: "82e62e24ad48ffc0292b9c2846b98e567e634d5df4771977dbedf1ee44134762",
  availabilityZone:
    "bcc3edcc1ecf38f75c2d62a8a50c99337509bd80a7f42db062efcda148bf6ff7",
  size: 1000,
  expiration: new Date("2020-06-06T15:44:11Z"),
  deviceName: null,
  hostID: "c04d193c4de174376167746bc268426a4085bffb364c4740e0564ca3eeee6875",
  host: {
    displayName: "",
    id: "c04d193c4de174376167746bc268426a4085bffb364c4740e0564ca3eeee6875",
  },
  homeVolume: true,
  creationTime: new Date("2020-06-05T15:44:11Z"),
  migrating: false,
};

const myHostBase: Omit<
  MyHostsQuery["myHosts"][0],
  "noExpiration" | "persistentDnsName" | "id"
> = {
  expiration: new Date("2021-10-28T22:37:40Z"),
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
    id: "home-volume-id",
    displayName: "",
  },
  instanceType: "m5.xlarge",
  instanceTags: [],
  volumes: [],
  provider: "ec2-ondemand",
  status: "running",
  startedBy: "ta.arst",
  tag: "evg-ubuntu1804-workstation-20201014223740-6478743249380995507",
  user: "ubuntu",
  uptime: new Date("2020-10-14T22:37:40Z"),
  displayName: "",
  availabilityZone: "us-east-1c",
  __typename: "Host",
};
const myHostsMock: ApolloMock<MyHostsQuery, MyHostsQueryVariables> = {
  request: {
    query: MY_HOSTS,
    variables: {},
  },
  result: {
    data: {
      myHosts: [
        {
          ...myHostBase,
          noExpiration: false,
          persistentDnsName: "",
          id: "i-05a2f286b802fd144",
          __typename: "Host",
        },
        {
          ...myHostBase,
          noExpiration: true,
          persistentDnsName:
            "ta-arst-workstation-123.workstations.build.10gen.cc",
          id: "i-09d810d09f9cd9a1d",
          __typename: "Host",
        },
        {
          ...myHostBase,
          noExpiration: true,
          persistentDnsName:
            "ta-arst-workstation-123.workstations.build.10gen.cc",
          id: "i-010cb384f2a0af1f4",
          __typename: "Host",
        },
        {
          ...myHostBase,
          noExpiration: false,
          persistentDnsName: "",
          id: "i-08bc47799b6331c58",
          __typename: "Host",
        },
      ],
    },
  },
};

const mocks = [getSpruceConfigMock, myHostsMock, myVolumesQueryMock];
