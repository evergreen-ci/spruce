import { MockedProvider, MockedResponse } from "@apollo/client/testing";
import { RenderFakeToastContext } from "context/toast/__mocks__";
import {
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
import { getUserMock } from "gql/mocks/getUser";
import { SPAWN_VOLUME } from "gql/mutations";
import {
  GET_MY_HOSTS,
  GET_SUBNET_AVAILABILITY_ZONES,
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
  it("does not render the Spawn Volume Modal when the visible prop is false", () => {
    const { Component } = RenderFakeToastContext(
      <SpawnVolumeModal
        visible={false}
        onCancel={() => {}}
        maxSpawnableLimit={1000}
      />
    );
    render(
      <MockedProvider mocks={baseMocks}>
        <Component />
      </MockedProvider>
    );
    expect(screen.queryByDataCy("spawn-volume-modal")).not.toBeInTheDocument();
  });

  it("form contains default values on initial render", async () => {
    const { Component } = RenderFakeToastContext(
      <SpawnVolumeModal visible onCancel={() => {}} maxSpawnableLimit={1000} />
    );
    render(
      <MockedProvider mocks={baseMocks}>
        <Component />
      </MockedProvider>
    );
    await waitFor(() => {
      expect(screen.queryByDataCy("spawn-volume-modal")).toBeVisible();
    });
    expect(screen.queryByDataCy("volume-size-input")).toHaveValue("500");
    expect(screen.queryByDataCy("availability-zone-select")).toHaveTextContent(
      "us-east-1a"
    );
    expect(screen.queryByDataCy("type-select")).toHaveTextContent("gp2");
    expect(screen.queryByLabelText("Never expire")).not.toBeChecked();
    expect(screen.queryByDataCy("host-select")).toBeDisabled();
    expect(screen.queryByText("No hosts available.")).toBeVisible();
  }, 10000);

  it("form submission succeeds with default values", async () => {
    const spawnVolumeMutation: ApolloMock<
      SpawnVolumeMutation,
      SpawnVolumeMutationVariables
    > = {
      request: {
        query: SPAWN_VOLUME,
        variables: {
          spawnVolumeInput: {
            availabilityZone: "us-east-1a",
            expiration: null,
            host: null,
            noExpiration: true,
            size: 500,
            type: "gp2",
          },
        },
      },
      result: { data: { spawnVolume: true } },
    };
    const { Component, dispatchToast } = RenderFakeToastContext(
      <SpawnVolumeModal visible onCancel={() => {}} maxSpawnableLimit={1000} />
    );
    render(
      <MockedProvider mocks={[...baseMocks, spawnVolumeMutation]}>
        <Component />
      </MockedProvider>
    );
    await waitFor(() => {
      expect(screen.queryByDataCy("spawn-volume-modal")).toBeVisible();
    });
    expect(screen.queryByLabelText("Never expire")).toBeEnabled();
    userEvent.click(screen.queryByLabelText("Never expire"));

    const spawnButton = screen.queryByRole("button", { name: "Spawn" });
    await waitFor(() => {
      expect(spawnButton).toBeEnabled();
    });
    userEvent.click(spawnButton);
    await waitFor(() => expect(dispatchToast.success).toHaveBeenCalledTimes(1));
  }, 10000);

  it("form submission succeeds after adjusting inputs", async () => {
    const spawnVolumeMutation: ApolloMock<
      SpawnVolumeMutation,
      SpawnVolumeMutationVariables
    > = {
      request: {
        query: SPAWN_VOLUME,
        variables: {
          spawnVolumeInput: {
            availabilityZone: "us-east-1c",
            expiration: null,
            host: "i-00b212e96b3f91079",
            noExpiration: true,
            size: 24,
            type: "st1",
          },
        },
      },
      result: { data: { spawnVolume: true } },
    };
    const { Component, dispatchToast } = RenderFakeToastContext(
      <SpawnVolumeModal visible onCancel={() => {}} maxSpawnableLimit={1000} />
    );
    render(
      <MockedProvider mocks={[...baseMocks, spawnVolumeMutation]}>
        <Component />
      </MockedProvider>
    );
    await waitFor(() => {
      expect(screen.queryByDataCy("spawn-volume-modal")).toBeVisible();
    });

    // Modify form values
    userEvent.clear(screen.queryByDataCy("volume-size-input"));
    userEvent.type(screen.queryByDataCy("volume-size-input"), "24");
    expect(screen.queryByDataCy("volume-size-input")).toHaveValue("24");
    await selectLGOption("availability-zone-select", "us-east-1c");
    await selectLGOption("type-select", "st1");
    await selectLGOption("host-select", "i-00b212e96b3f91079");
    expect(screen.queryByLabelText("Never expire")).toBeEnabled();
    userEvent.click(screen.queryByLabelText("Never expire"));

    // Click spawn button
    const spawnButton = screen.queryByRole("button", { name: "Spawn" });
    await waitFor(() => {
      expect(spawnButton).toBeEnabled();
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
          id: "i-00a902e96b3f91079",
          instanceTags: [
            {
              __typename: "InstanceTag",
              canBeModified: false,
              key: "name",
              value: "i-00a902e96b3f91079",
            },
            {
              __typename: "InstanceTag",
              canBeModified: false,
              key: "distro",
              value: "ubuntu1804-workstation",
            },
            {
              __typename: "InstanceTag",
              canBeModified: false,
              key: "evergreen-service",
              value: "evergreenapp-19.build.10gen.cc",
            },
            {
              __typename: "InstanceTag",
              canBeModified: false,
              key: "username",
              value: "evergreen application server user",
            },
            {
              __typename: "InstanceTag",
              canBeModified: false,
              key: "owner",
              value: "taaaa.arst",
            },
            {
              __typename: "InstanceTag",
              canBeModified: false,
              key: "mode",
              value: "production",
            },
            {
              __typename: "InstanceTag",
              canBeModified: false,
              key: "start-time",
              value: "20201014223740",
            },
            {
              __typename: "InstanceTag",
              canBeModified: false,
              key: "expire-on",
              value: "2020-11-13",
            },
          ],
          instanceType: "m5.xlarge",
          noExpiration: false,
          provider: "ec2-ondemand",
          startedBy: "arst.arst",
          status: "running",
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
        },
        {
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
          id: "i-00b212e96b3f91079",
          instanceTags: [
            {
              __typename: "InstanceTag",
              canBeModified: false,
              key: "name",
              value: "i-00b212e96b3f91079",
            },
            {
              __typename: "InstanceTag",
              canBeModified: false,
              key: "distro",
              value: "ubuntu1804-workstation",
            },
            {
              __typename: "InstanceTag",
              canBeModified: false,
              key: "evergreen-service",
              value: "evergreenapp-19.build.10gen.cc",
            },
            {
              __typename: "InstanceTag",
              canBeModified: false,
              key: "username",
              value: "evergreen application server user",
            },
            {
              __typename: "InstanceTag",
              canBeModified: false,
              key: "owner",
              value: "asrta.asrt",
            },
            {
              __typename: "InstanceTag",
              canBeModified: false,
              key: "mode",
              value: "production",
            },
            {
              __typename: "InstanceTag",
              canBeModified: false,
              key: "start-time",
              value: "20201014223740",
            },
            {
              __typename: "InstanceTag",
              canBeModified: false,
              key: "expire-on",
              value: "2020-11-13",
            },
          ],
          instanceType: "m5.xlarge",
          noExpiration: false,
          provider: "ec2-ondemand",
          startedBy: "asrt.arsts",
          status: "running",
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
            __typename: "Volume",
            availabilityZone: "us-east-1d",
            createdBy: "arjrsatun.psratatel",
            creationTime: new Date("2020-11-05T18:19:39Z"),
            deviceName: null,
            displayName: "",
            expiration: new Date("2020-11-12T18:19:39Z"),
            homeVolume: false,
            host: {
              __typename: "Host",
              displayName: "hai",
              id: "i-0d5d29bf2e7ee342d",
              noExpiration: false,
            },
            hostID: "i-0d5d29bf2e7ee342d",
            id: "vol-0228202a15111023c",
            migrating: false,
            noExpiration: false,
            size: 200,
            type: "gp2",
          },
          {
            __typename: "Volume",
            availabilityZone: "us-east-1d",
            createdBy: "arrastrjun.prastatel",
            creationTime: new Date("2020-11-05T18:18:36Z"),
            deviceName: null,
            displayName: "ramen",
            expiration: new Date("2020-11-12T18:24:09Z"),
            homeVolume: false,
            host: {
              __typename: "Host",
              displayName: "hai",
              id: "i-0d5d29bf2e7ee342d",
              noExpiration: false,
            },
            hostID: "i-0d5d29bf2e7ee342d",
            id: "vol-0d7b1973c71a7cccb",
            migrating: false,
            noExpiration: false,
            size: 100,
            type: "gp2",
          },
        ],
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
  getUserMock,
  subnetZonesMock,
  myHostsMock,
  getSpruceConfigMock,
  myVolumesQueryMock,
];
