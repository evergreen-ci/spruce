import { MockedProvider, MockedResponse } from "@apollo/client/testing";
import { RenderFakeToastContext } from "context/toast/__mocks__";
import {
  GetUserQuery,
  GetUserQueryVariables,
  MyHostsQuery,
  MyHostsQueryVariables,
  MyVolumesQuery,
  MyVolumesQueryVariables,
  SpawnVolumeMutation,
  SpawnVolumeMutationVariables,
  SubnetAvailabilityZonesQuery,
  SubnetAvailabilityZonesQueryVariables,
} from "gql/generated/types";
import { getSpruceConfigMock } from "gql/mocks/getSpruceConfig";
import { SPAWN_VOLUME } from "gql/mutations";
import {
  GET_MY_HOSTS,
  GET_SUBNET_AVAILABILITY_ZONES,
  GET_USER,
  GET_MY_VOLUMES,
} from "gql/queries";
import {
  userEvent,
  renderWithRouterMatch as render,
  screen,
  waitFor,
} from "test_utils";
import { selectLGOption } from "test_utils/utils";
import { ApolloMock } from "types/gql";
import { SpawnVolumeModal } from "./SpawnVolumeModal";

describe("spawnVolumeModal", () => {
  it("renders the Spawn Volume Modal when the visible prop is true", async () => {
    const { Component } = RenderFakeToastContext(
      <SpawnVolumeModal visible onCancel={() => {}} />
    );
    render(
      <MockedProvider mocks={baseMocks}>
        <Component />
      </MockedProvider>
    );
    expect(screen.queryByDataCy("spawn-volume-modal")).toBeVisible();
  });

  it("does not renders the Spawn Volume Modal when the visible prop is false", async () => {
    const { Component } = RenderFakeToastContext(
      <SpawnVolumeModal visible={false} onCancel={() => {}} />
    );
    render(
      <MockedProvider mocks={baseMocks}>
        <Component />
      </MockedProvider>
    );
    expect(screen.queryByDataCy("modal-title")).not.toBeInTheDocument();
  });

  it("form contains default volumes on initial render", async () => {
    const { Component } = RenderFakeToastContext(
      <SpawnVolumeModal visible onCancel={() => {}} />
    );
    render(
      <MockedProvider mocks={baseMocks}>
        <Component />
      </MockedProvider>
    );
    await waitFor(() =>
      expect(screen.queryByDataCy("volumeSize")).toHaveValue(500)
    );

    expect(screen.queryByDataCy("regionSelector")).toHaveTextContent(
      "us-east-1a"
    );
    expect(screen.queryByDataCy("typeSelector")).toHaveTextContent("gp2");
    expect(screen.queryByDataCy("never-expire-checkbox")).not.toBeChecked();
    expect(screen.queryByDataCy("host-select")).toHaveTextContent("");
  });

  it("form submission succeeds with default values", async () => {
    const spawnVolumeMutation: ApolloMock<
      SpawnVolumeMutation,
      SpawnVolumeMutationVariables
    > = {
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
    };
    const { Component, dispatchToast } = RenderFakeToastContext(
      <SpawnVolumeModal visible onCancel={() => {}} />
    );
    render(
      <MockedProvider mocks={[...baseMocks, spawnVolumeMutation]}>
        <Component />
      </MockedProvider>
    );
    const spawnButton = screen.queryByRole("button", { name: "Spawn" });
    await waitFor(() => {
      expect(spawnButton).not.toBeDisabled();
    });
    userEvent.click(spawnButton);
    await waitFor(() => expect(dispatchToast.success).toHaveBeenCalledTimes(1));
  });

  it("form submission succeeds after adjusting inputs", async () => {
    const spawnVolumeMutation: ApolloMock<
      SpawnVolumeMutation,
      SpawnVolumeMutationVariables
    > = {
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
    };
    const { Component, dispatchToast } = RenderFakeToastContext(
      <SpawnVolumeModal visible onCancel={() => {}} />
    );

    render(
      <MockedProvider mocks={[...baseMocks, spawnVolumeMutation]}>
        <Component />
      </MockedProvider>
    );
    // select us-east-1c region
    await selectLGOption("regionSelector", "us-east-1c");
    await selectLGOption("typeSelector", "st1");
    await selectLGOption("host-select", "i-00b212e96b3f91079");
    userEvent.type(screen.queryByDataCy("volumeSize"), "{clear}24");
    expect(screen.queryByDataCy("volumeSize")).toHaveValue(24);

    // Click spawn button
    const spawnButton = screen.queryByRole("button", { name: "Spawn" });
    await waitFor(() => {
      expect(spawnButton).not.toBeDisabled();
    });
    userEvent.click(spawnButton);
    await waitFor(() => expect(dispatchToast.success).toHaveBeenCalledTimes(1));
  }, 10000);
});

const myHostsMock: ApolloMock<MyHostsQuery, MyHostsQueryVariables> = {
  request: {
    query: GET_MY_HOSTS,
    variables: {},
  },
  result: {
    data: {
      myHosts: [
        {
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
            displayName: "",
          },
          id: "i-00a902e96b3f91079",
          instanceType: "m5.xlarge",
          instanceTags: [
            {
              key: "name",
              value: "i-00a902e96b3f91079",
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
              value: "taaaa.arst",
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
              migrating: false,
              id: "vol-0cf616375140c067e",
              __typename: "Volume",
            },
          ],
          noExpiration: false,
          provider: "ec2-ondemand",
          status: "running",
          startedBy: "arst.arst",
          tag: "evg-ubuntu1804-workstation-20201014223740-6478743249380995507",
          user: "ubuntu",
          uptime: new Date("2020-10-14T22:37:40Z"),
          displayName: "",
          availabilityZone: "us-east-1c",
          __typename: "Host",
        },
        {
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
              value: "asrta.asrt",
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
              migrating: false,
              id: "vol-0cf616375140c067e",
              __typename: "Volume",
            },
          ],
          noExpiration: false,
          provider: "ec2-ondemand",
          status: "running",
          startedBy: "asrt.arsts",
          tag: "evg-ubuntu1804-workstation-20201014223740-6478743249380995507",
          user: "ubuntu",
          uptime: new Date("2020-10-14T22:37:40Z"),
          displayName: "",
          availabilityZone: "us-east-1c",
          __typename: "Host",
        },
      ],
    },
  },
};

const myVolumesQueryMock: ApolloMock<MyVolumesQuery, MyVolumesQueryVariables> =
  {
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
            expiration: new Date("2020-11-12T18:19:39Z"),
            deviceName: null,
            hostID: "i-0d5d29bf2e7ee342d",
            host: {
              displayName: "hai",
              id: "i-0d5d29bf2e7ee342d",
              noExpiration: false,
              __typename: "Host",
            },
            noExpiration: true,
            homeVolume: false,
            creationTime: new Date("2020-11-05T18:19:39Z"),
            migrating: false,
            __typename: "Volume",
          },
          {
            id: "vol-0d7b1973c71a7cccb",
            displayName: "ramen",
            createdBy: "arrastrjun.prastatel",
            type: "gp2",
            availabilityZone: "us-east-1d",
            size: 100,
            expiration: new Date("2020-11-12T18:24:09Z"),
            deviceName: null,
            hostID: "i-0d5d29bf2e7ee342d",
            host: {
              displayName: "hai",
              id: "i-0d5d29bf2e7ee342d",
              noExpiration: false,
              __typename: "Host",
            },
            noExpiration: true,
            homeVolume: false,
            migrating: false,
            creationTime: new Date("2020-11-05T18:18:36Z"),
            __typename: "Volume",
          },
        ],
      },
    },
  };

const userMock: ApolloMock<GetUserQuery, GetUserQueryVariables> = {
  request: {
    query: GET_USER,
    variables: {},
  },
  result: {
    data: {
      user: {
        userId: "a",
        displayName: "A",
        emailAddress: "a@mongodb.com",
      },
    },
  },
};

const subnetZonesMock: ApolloMock<
  SubnetAvailabilityZonesQuery,
  SubnetAvailabilityZonesQueryVariables
> = {
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

const baseMocks: MockedResponse[] = [
  userMock,
  subnetZonesMock,
  myHostsMock,
  getSpruceConfigMock,
  myVolumesQueryMock,
];
