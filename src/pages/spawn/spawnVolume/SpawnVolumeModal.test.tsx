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
import { MY_HOSTS, SUBNET_AVAILABILITY_ZONES, MY_VOLUMES } from "gql/queries";
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
      />,
    );
    render(
      <MockedProvider mocks={baseMocks}>
        <Component />
      </MockedProvider>,
    );
    expect(screen.queryByDataCy("spawn-volume-modal")).not.toBeInTheDocument();
  });

  it("form contains default values on initial render", async () => {
    const { Component } = RenderFakeToastContext(
      <SpawnVolumeModal visible onCancel={() => {}} maxSpawnableLimit={1000} />,
    );
    render(
      <MockedProvider mocks={baseMocks}>
        <Component />
      </MockedProvider>,
    );
    await waitFor(() => {
      expect(screen.queryByDataCy("spawn-volume-modal")).toBeVisible();
    });
    expect(screen.queryByDataCy("volume-size-input")).toHaveValue("256");
    expect(screen.queryByDataCy("availability-zone-select")).toHaveTextContent(
      "us-east-1a",
    );
    expect(screen.queryByDataCy("type-select")).toHaveTextContent("gp2");
    expect(screen.queryByLabelText("Never expire")).not.toBeChecked();
    expect(screen.queryByDataCy("host-select")).toHaveAttribute(
      "aria-disabled",
      "true",
    );
    expect(screen.queryByText("No hosts available.")).toBeVisible();
  });

  it("form submission succeeds with default values", async () => {
    const user = userEvent.setup();
    const spawnVolumeMutation: ApolloMock<
      SpawnVolumeMutation,
      SpawnVolumeMutationVariables
    > = {
      request: {
        query: SPAWN_VOLUME,
        variables: {
          spawnVolumeInput: {
            availabilityZone: "us-east-1a",
            size: 256,
            type: "gp2",
            expiration: null,
            noExpiration: true,
            host: null,
          },
        },
      },
      result: { data: { spawnVolume: true } },
    };
    const { Component, dispatchToast } = RenderFakeToastContext(
      <SpawnVolumeModal visible onCancel={() => {}} maxSpawnableLimit={1000} />,
    );
    render(
      <MockedProvider mocks={[...baseMocks, spawnVolumeMutation]}>
        <Component />
      </MockedProvider>,
    );
    await waitFor(() => {
      expect(screen.queryByDataCy("spawn-volume-modal")).toBeVisible();
    });
    expect(screen.queryByLabelText("Never expire")).toBeEnabled();
    await user.click(screen.getByText("Never expire"));

    const spawnButton = screen.queryByRole("button", { name: "Spawn" });
    await waitFor(() => {
      expect(spawnButton).toBeEnabled();
    });
    await user.click(spawnButton);
    expect(dispatchToast.success).toHaveBeenCalledTimes(1);
  });

  it("form submission succeeds after adjusting inputs", async () => {
    const user = userEvent.setup();
    const spawnVolumeMutation: ApolloMock<
      SpawnVolumeMutation,
      SpawnVolumeMutationVariables
    > = {
      request: {
        query: SPAWN_VOLUME,
        variables: {
          spawnVolumeInput: {
            availabilityZone: "us-east-1c",
            size: 24,
            type: "st1",
            expiration: null,
            noExpiration: true,
            host: "i-00b212e96b3f91079",
          },
        },
      },
      result: { data: { spawnVolume: true } },
    };
    const { Component, dispatchToast } = RenderFakeToastContext(
      <SpawnVolumeModal visible onCancel={() => {}} maxSpawnableLimit={1000} />,
    );
    render(
      <MockedProvider mocks={[...baseMocks, spawnVolumeMutation]}>
        <Component />
      </MockedProvider>,
    );
    await waitFor(() => {
      expect(screen.queryByDataCy("spawn-volume-modal")).toBeVisible();
    });

    // Modify form values
    await user.clear(screen.queryByDataCy("volume-size-input"));
    await user.type(screen.queryByDataCy("volume-size-input"), "24");
    expect(screen.queryByDataCy("volume-size-input")).toHaveValue("24");
    await selectLGOption("availability-zone-select", "us-east-1c");
    await selectLGOption("type-select", "st1");
    await selectLGOption("host-select", "i-00b212e96b3f91079");
    expect(screen.queryByLabelText("Never expire")).toBeEnabled();
    await user.click(screen.getByText("Never expire"));

    // Click spawn button
    const spawnButton = screen.queryByRole("button", { name: "Spawn" });
    await waitFor(() => {
      expect(spawnButton).toBeEnabled();
    });
    await user.click(spawnButton);
    expect(dispatchToast.success).toHaveBeenCalledTimes(1);
  });
});

const myHostsMock: ApolloMock<MyHostsQuery, MyHostsQueryVariables> = {
  request: {
    query: MY_HOSTS,
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
            id: "home-volume-id",
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
          persistentDnsName: "",
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
            id: "home-volume-id",
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
          persistentDnsName: "",
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
    request: { query: MY_VOLUMES, variables: {} },
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
            noExpiration: false,
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
            noExpiration: false,
            homeVolume: false,
            migrating: false,
            creationTime: new Date("2020-11-05T18:18:36Z"),
            __typename: "Volume",
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
    query: SUBNET_AVAILABILITY_ZONES,
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
