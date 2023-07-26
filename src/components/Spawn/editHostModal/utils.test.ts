import { EditSpawnHostMutationVariables } from "gql/generated/types";
import { computeDiff } from "./utils";

describe("computeDiff", () => {
  it("correctly computes diff when there is no change", () => {
    const [hasChanges, mutationParams] = computeDiff(
      initialEditState,
      initialEditState
    );
    expect(hasChanges).toBe(false);
    expect(mutationParams).toStrictEqual({});
  });

  it("correctly computes diff when there is change, omitting unchanged fields", () => {
    const [hasChanges, mutationParams] = computeDiff(
      initialEditState,
      currEditState
    );
    expect(hasChanges).toBe(true);
    // eslint-disable-next-line jest/prefer-strict-equal
    expect(mutationParams).toEqual({
      addedInstanceTags: [
        { key: "a", value: " b" },
        { key: "c", value: " d" },
      ],
      displayName: "new-display-name",
      instanceType: "new-instance-type",
      publicKey: {
        key: "newKey",
        name: "newKeyName",
      },
      servicePassword: "rdp-password",
    });
  });
});

const host = {
  displayName: "",
  expiration: new Date("2022-12-06T11:00:05.055Z"),
  id: "host-id",
  instanceType: "m4.xlarge",
  noExpiration: true,
};

const initialEditState: EditSpawnHostMutationVariables = {
  addedInstanceTags: [],
  deletedInstanceTags: [],
  displayName: host.displayName,
  expiration: null,
  hostId: host.id,
  instanceType: host.instanceType,
  noExpiration: host.noExpiration,
  publicKey: {
    key: "",
    name: "",
  },
  savePublicKey: false,
  servicePassword: "",
  volumeId: "",
};

const currEditState: EditSpawnHostMutationVariables = {
  addedInstanceTags: [
    { key: "a", value: " b" },
    { key: "c", value: " d" },
  ],
  deletedInstanceTags: [],
  displayName: "new-display-name",
  expiration: null,
  hostId: host.id,
  instanceType: "new-instance-type",
  noExpiration: host.noExpiration,
  publicKey: {
    key: "newKey",
    name: "newKeyName",
  },
  savePublicKey: false,
  servicePassword: "rdp-password",
  volumeId: "",
};
