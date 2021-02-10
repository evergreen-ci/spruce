import React from "react";
import { MockedProvider } from "@apollo/client/testing";
import { SPAWN_VOLUME } from "gql/mutations/spawn-volume";
import {
  GET_MY_HOSTS,
  GET_SPRUCE_CONFIG,
  GET_SUBNET_AVAILABILITY_ZONES,
  GET_USER,
  GET_MY_VOLUMES,
} from "gql/queries";

import {
  customRenderWithRouterMatch as render,
  fireEvent,
  waitFor,
  act,
} from "test_utils/test-utils";
import { SpawnVolumeModal } from "./SpawnVolumeModal";

const myHostsMock = {
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
          homeVolume: {
            displayName: "",
          },
          id: "i-00b212e96b3f91079",
          instanceType: "m5.xlarge",
          instanceTags: [
            {
              key: "name",
              value: "i-00b212e96b3f91079",
              canBeModified: false,
              __typename: "InstanceTag",
            },
            {
              key: "distro",
              value: "ubuntu1804-workstation",
              canBeModified: false,
              __typename: "InstanceTag",
            },
            {
              key: "evergreen-service",
              value: "evergreenapp-19.build.10gen.cc",
              canBeModified: false,
              __typename: "InstanceTag",
            },
            {
              key: "username",
              value: "evergreen application server user",
              canBeModified: false,
              __typename: "InstanceTag",
            },
            {
              key: "owner",
              value: "arjun.patel",
              canBeModified: false,
              __typename: "InstanceTag",
            },
            {
              key: "mode",
              value: "production",
              canBeModified: false,
              __typename: "InstanceTag",
            },
            {
              key: "start-time",
              value: "20201014223740",
              canBeModified: false,
              __typename: "InstanceTag",
            },
            {
              key: "expire-on",
              value: "2020-11-13",
              canBeModified: false,
              __typename: "InstanceTag",
            },
          ],
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

const spruceConfigMock = {
  request: {
    query: GET_SPRUCE_CONFIG,
    variables: {},
  },
  result: {
    data: {
      spruceConfig: {
        bannerTheme: "warning",
        banner: "",
        ui: {
          userVoice: "https://feedback.mongodb.com/forums/930019-evergreen",
          __typename: "UIConfig",
        },
        jira: { host: "jira.mongodb.org", __typename: "JiraConfig" },
        providers: {
          aws: { maxVolumeSizePerUser: 1500, __typename: "AWSConfig" },
          __typename: "CloudProviderConfig",
        },
        spawnHost: {
          spawnHostsPerUser: 6,
          unexpirableHostsPerUser: 2,
          unexpirableVolumesPerUser: 1,
          __typename: "SpawnHostConfig",
        },
        __typename: "SpruceConfig",
      },
    },
  },
};

const myVolumesQueryMock = {
  request: { query: GET_MY_VOLUMES, variables: {} },
  result: {
    data: {
      myVolumes: [
        {
          id: "vol-0228202a15111023c",
          displayName: "",
          createdBy: "arjrsatun.psratatel",
          type: "gp2",
          availabilityZone: "us-east-1d",
          size: 200,
          expiration: "2020-11-12T18:19:39Z",
          deviceName: null,
          hostID: "i-0d5d29bf2e7ee342d",
          host: {
            displayName: "hai",
            id: "i-0d5d29bf2e7ee342d",
            __typename: "Host",
          },
          noExpiration: true,
          homeVolume: false,
          creationTime: "2020-11-05T18:19:39Z",
          __typename: "Volume",
        },
        {
          id: "vol-0d7b1973c71a7cccb",
          displayName: "ramen",
          createdBy: "arrastrjun.prastatel",
          type: "gp2",
          availabilityZone: "us-east-1d",
          size: 100,
          expiration: "2020-11-12T18:24:09Z",
          deviceName: null,
          hostID: "i-0d5d29bf2e7ee342d",
          host: {
            displayName: "hai",
            id: "i-0d5d29bf2e7ee342d",
            __typename: "Host",
          },
          noExpiration: true,
          homeVolume: false,
          creationTime: "2020-11-05T18:18:36Z",
          __typename: "Volume",
        },
      ],
    },
  },
};

const userMock = {
  request: {
    query: GET_USER,
    variables: {},
  },
  result: {
    data: {
      user: {
        userId: "a",
        displayName: "A",
      },
    },
  },
};

const subnetZonesMock = {
  request: {
    query: GET_SUBNET_AVAILABILITY_ZONES,
    variables: {},
  },
  result: {
    data: {
      subnetAvailabilityZones: [
        "us-east-1a",
        "us-east-1b",
        "us-east-1c",
        "us-east-1d",
        "us-east-1e",
        "us-east-1f",
        "us-west-1a",
        "us-west-1c",
        "ap-southeast-2a",
        "ap-southeast-2b",
        "eu-west-1a",
        "eu-west-1b",
      ],
    },
  },
};

const baseMocks = [
  userMock,
  subnetZonesMock,
  myHostsMock,
  spruceConfigMock,
  myVolumesQueryMock,
];

const mockSuccessToast = jest.fn();
const mockErrorToast = jest.fn();
jest.mock("context/toast", () => ({
  useToastContext: () => ({
    success: mockSuccessToast,
    error: mockErrorToast,
  }),
}));

beforeEach(() => {
  mockSuccessToast.mockClear();
  mockErrorToast.mockClear();
});

test("Renders the Spawn Volume Modal when the visible prop is true", async () => {
  const { queryByDataCy } = render(() => (
    <MockedProvider mocks={baseMocks}>
      <SpawnVolumeModal visible onCancel={() => {}} />
    </MockedProvider>
  ));
  expect(queryByDataCy("modal-title")).toBeVisible();
});

test("Does not renders the Spawn Volume Modal when the visible prop is false", async () => {
  const { queryByDataCy } = render(() => (
    <MockedProvider mocks={baseMocks}>
      <SpawnVolumeModal visible={false} onCancel={() => {}} />
    </MockedProvider>
  ));
  expect(queryByDataCy("modal-title")).not.toBeInTheDocument();
});

test("Form contains default volumes on initial render.", async () => {
  const { queryByDataCy } = render(() => (
    <MockedProvider mocks={baseMocks}>
      <SpawnVolumeModal visible onCancel={() => {}} />
    </MockedProvider>
  ));
  await act(() => new Promise((resolve) => setTimeout(resolve, 0)));
  await waitFor(() => expect(queryByDataCy("volumeSize")).toHaveValue("500"));

  expect(queryByDataCy("regionSelector")).toContainHTML(
    '<span class="ant-select-selection-item" title="us-east-1a">us-east-1a</span>'
  );
  expect(queryByDataCy("typeSelector")).toContainHTML(
    '<span class="ant-select-selection-item" title="gp2">gp2</span>'
  );
  expect(queryByDataCy("neverExpireCheckbox")).toHaveAttribute(
    "aria-checked",
    "false"
  );
  expect(queryByDataCy("host-select")).toContainHTML(
    '<span class="ant-select-selection-item" title=" "> </span>'
  );
});

test("Form submission succeeds with default values", async () => {
  const mocks = [
    ...baseMocks,
    userMock,
    subnetZonesMock,
    myHostsMock,
    myHostsMock,
    spruceConfigMock,
    myVolumesQueryMock,
    {
      request: {
        query: SPAWN_VOLUME,
        variables: {
          SpawnVolumeInput: {
            availabilityZone: "us-east-1a",
            size: 500,
            type: "gp2",
            expiration: null,
            noExpiration: false,
          },
        },
      },
      result: { data: { spawnVolume: true } },
    },
    myVolumesQueryMock,
    myVolumesQueryMock,
    spruceConfigMock,
  ];
  const { queryByText } = render(() => (
    <MockedProvider mocks={mocks}>
      <SpawnVolumeModal visible onCancel={() => {}} />
    </MockedProvider>
  ));
  await act(() => new Promise((resolve) => setTimeout(resolve, 0)));
  fireEvent.click(queryByText("Spawn"));
  await waitFor(() => expect(mockSuccessToast).toHaveBeenCalledTimes(1));
  await waitFor(() => expect(mockErrorToast).toHaveBeenCalledTimes(0));
});

test("Form submission succeeds after adjusting inputs", async () => {
  const mocks = [
    ...baseMocks,
    userMock,
    subnetZonesMock,
    myHostsMock,
    spruceConfigMock,
    myVolumesQueryMock,
    {
      request: {
        query: SPAWN_VOLUME,
        variables: {
          SpawnVolumeInput: {
            availabilityZone: "us-east-1c",
            size: 24,
            type: "st1",
            expiration: null,
            noExpiration: false,
            host: "i-00b212e96b3f91079",
          },
        },
      },
      result: { data: { spawnVolume: true } },
    },
    myVolumesQueryMock,
    spruceConfigMock,
    myHostsMock,
  ];
  const { queryByText, queryByDataCy } = render(() => (
    <MockedProvider addTypename={false} mocks={mocks}>
      <SpawnVolumeModal visible onCancel={() => {}} />
    </MockedProvider>
  ));
  await act(() => new Promise((resolve) => setTimeout(resolve, 0)));
  fireEvent.change(queryByDataCy("volumeSize"), { target: { value: "24" } });
  fireEvent.mouseDown(queryByDataCy("regionSelector").firstElementChild);
  fireEvent.click(queryByText("us-east-1c"));
  fireEvent.mouseDown(queryByDataCy("typeSelector").firstElementChild);
  fireEvent.click(queryByText("st1"));
  fireEvent.mouseDown(queryByDataCy("host-select").firstElementChild);
  fireEvent.click(queryByDataCy("i-00b212e96b3f91079-option"));
  fireEvent.click(queryByText("Spawn"));
  await waitFor(() => expect(mockSuccessToast).toHaveBeenCalledTimes(1));
  await waitFor(() => expect(mockErrorToast).toHaveBeenCalledTimes(0));
});
