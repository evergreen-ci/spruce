import React from "react";
import { MockedProvider } from "@apollo/react-testing";
import { GET_USER } from "gql/queries";
import { render } from "test_utils/test-utils";
import { SpawnVolumeTableActions } from "./SpawnVolumeTableActions";

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
];

test("Unmount btn is visible and the delete btn does not exist when the volume is mounted to a host", () => {
  const volumeWithHost = {
    id: "vol-fcc5accfb588e",
    displayName: "",
    createdBy: "l",
    type: "gp2",
    availabilityZone: "us-east-1a",
    size: 500,
    expiration: new Date("2020-11-09T19:01:38Z"),
    deviceName: null,
    hostID: "i-0dc290cc541a8",
    host: { displayName: "", id: "i-07d46dc290cc541a8" },
    noExpiration: true,
    homeVolume: false,
    creationTime: new Date("2020-11-02T18:54:24Z"),
  };
  const { queryByDataCy } = render(
    <MockedProvider mocks={baseMocks}>
      <SpawnVolumeTableActions volume={volumeWithHost} />
    </MockedProvider>
  );
  expect(queryByDataCy("detach-btn-vol-fcc5accfb588e")).toBeVisible();
  expect(queryByDataCy("trash-vol-fcc5accfb588e")).toBeNull();
  expect(queryByDataCy("mount-vol-fcc5accfb588e")).toBeNull();
  expect(queryByDataCy("edit-btn-vol-fcc5accfb588e")).toBeVisible();
});

test("Unmount button does not exist and trash button is visible when the volume is not mounted to a host.", () => {
  const volumeWithoutHost = {
    id: "vol-fcc5accfb588e",
    displayName: "",
    createdBy: "l",
    type: "gp2",
    availabilityZone: "us-east-1a",
    size: 500,
    expiration: new Date("2020-11-09T19:01:38Z"),
    deviceName: null,
    hostID: "",
    host: { displayName: "", id: "i-07d46dc290cc541a8" },
    noExpiration: true,
    homeVolume: false,
    creationTime: new Date("2020-11-02T18:54:24Z"),
  };
  const { queryByDataCy } = render(
    <MockedProvider mocks={baseMocks}>
      <SpawnVolumeTableActions volume={volumeWithoutHost} />
    </MockedProvider>
  );
  expect(queryByDataCy("detach-btn-vol-fcc5accfb588e")).toBeNull();
  expect(queryByDataCy("trash-vol-fcc5accfb588e")).toBeVisible();
  expect(queryByDataCy("mount-vol-fcc5accfb588e")).toBeVisible();
  expect(queryByDataCy("edit-btn-vol-fcc5accfb588e")).toBeVisible();
});
