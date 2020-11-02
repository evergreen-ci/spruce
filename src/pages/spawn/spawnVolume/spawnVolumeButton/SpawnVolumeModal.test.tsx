import React from "react";
import { MockedProvider } from "@apollo/client/testing";
import { SPAWN_VOLUME } from "gql/mutations/spawn-volume";
import {
  GET_MY_HOSTS,
  GET_SUBNET_AVAILABILITY_ZONES,
  GET_USER,
} from "gql/queries";
import {
  act,
  customRenderWithRouterMatch as render,
  fireEvent,
  waitFor,
} from "test_utils/test-utils";
import { SpawnVolumeModal } from "./SpawnVolumeModal";

const baseMocks = [
  {
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
  },
  {
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
  },
  {
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
              __typename: "DistroInfo",
            },
            hostUrl: "ec2-34-201-138-106.compute-1.amazonaws.com",
            homeVolumeID: "vol-07fa9f6b5c2067e34",
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
            tag:
              "evg-ubuntu1804-workstation-20201014223740-6478743249380995507",
            user: "ubuntu",
            uptime: "2020-10-14T22:37:40Z",
            displayName: "",
            availabilityZone: "us-east-1c",
            __typename: "Host",
          },
        ],
      },
    },
  },
];

const mockSuccessBanner = jest.fn();
jest.mock("context/banners", () => ({
  useBannerDispatchContext: () => ({
    successBanner: mockSuccessBanner,
    errorBanner: (e) => {
      console.log(e);
    },
  }),
}));

beforeEach(() => {
  mockSuccessBanner.mockClear();
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
  expect(queryByDataCy("volumeSize")).toHaveValue("500");
  expect(queryByDataCy("regionSelector")).toContainHTML(
    '<span class="ant-select-selection-item" title="us-east-1a">us-east-1a</span>'
  );
  expect(queryByDataCy("typeSelector")).toContainHTML(
    '<span class="ant-select-selection-item" title="gp2">gp2</span>'
  );
  expect(queryByDataCy("neverExpireCheckbox")).toHaveAttribute(
    "aria-checked",
    "true"
  );
  expect(queryByDataCy("host-select")).toContainHTML(
    '<span class="ant-select-selection-item" title=" "> </span>'
  );
});

test("Form submission succeeds with default values", async () => {
  const mocks = [
    ...baseMocks,
    {
      request: {
        query: SPAWN_VOLUME,
        variables: {
          SpawnVolumeInput: {
            availabilityZone: "us-east-1a",
            size: 500,
            type: "gp2",
            noExpiration: true,
          },
        },
      },
      result: { data: { spawnVolume: true } },
    },
  ];
  const { queryByText } = render(() => (
    <MockedProvider mocks={mocks}>
      <SpawnVolumeModal visible onCancel={() => {}} />
    </MockedProvider>
  ));

  await new Promise((resolve) => setTimeout(resolve, 0));
  fireEvent.click(queryByText("Spawn"));
  await new Promise((resolve) => setTimeout(resolve, 0));
  waitFor(() => expect(mockSuccessBanner).toBeCalledTimes(1));
});

test("Form submission succeeds after adjusting inputs", async () => {
  const mocks = [
    ...baseMocks,
    {
      request: {
        query: SPAWN_VOLUME,
        variables: {
          SpawnVolumeInput: {
            availabilityZone: "us-east-1c",
            size: 24,
            type: "st1",
            noExpiration: true,
            host: "i-00b212e96b3f91079",
          },
        },
      },
      result: { data: { spawnVolume: true } },
    },
  ];
  const { queryByText, queryByDataCy } = render(() => (
    <MockedProvider addTypename={false} mocks={mocks}>
      <SpawnVolumeModal visible onCancel={() => {}} />
    </MockedProvider>
  ));
  await new Promise((resolve) => setTimeout(resolve, 0));
  fireEvent.change(queryByDataCy("volumeSize"), { target: { value: "24" } });
  fireEvent.mouseDown(queryByDataCy("regionSelector").firstElementChild);
  fireEvent.click(queryByText("us-east-1c"));
  fireEvent.mouseDown(queryByDataCy("typeSelector").firstElementChild);
  fireEvent.click(queryByText("st1"));
  fireEvent.mouseDown(queryByDataCy("host-select").firstElementChild);
  fireEvent.click(queryByDataCy("i-00b212e96b3f91079-option"));
  await new Promise((resolve) => setTimeout(resolve, 0));
  act(() => fireEvent.click(queryByText("Spawn")));
  await new Promise((resolve) => setTimeout(resolve, 0));
  waitFor(() => expect(mockSuccessBanner).toBeCalledTimes(1));
});
