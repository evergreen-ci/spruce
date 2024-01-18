import { EditSpawnHostMutationVariables } from "gql/generated/types";
import { computeDiff } from "./utils";

describe("computeDiff", () => {
  it("correctly computes diff when there is no change", () => {
    const [hasChanges, mutationParams] = computeDiff(
      initialEditState,
      initialEditState,
    );
    expect(hasChanges).toBe(false);
    expect(mutationParams).toStrictEqual({});
  });

  it("correctly computes diff when there is change, omitting unchanged fields", () => {
    const [hasChanges, mutationParams] = computeDiff(
      initialEditState,
      currEditState,
    );
    expect(hasChanges).toBe(true);
    // eslint-disable-next-line jest/prefer-strict-equal
    expect(mutationParams).toEqual({
      displayName: "new-display-name",
      instanceType: "new-instance-type",
      addedInstanceTags: [
        { key: "a", value: " b" },
        { key: "c", value: " d" },
      ],
      servicePassword: "rdp-password",
      publicKey: {
        name: "newKeyName",
        key: "newKey",
      },
    });
  });
});

const host = {
  id: "host-id",
  displayName: "",
  noExpiration: true,
  expiration: new Date("2022-12-06T11:00:05.055Z"),
  instanceType: "m4.xlarge",
};

const initialEditState: EditSpawnHostMutationVariables = {
  hostId: host.id,
  displayName: host.displayName,
  expiration: null,
  noExpiration: host.noExpiration,
  instanceType: host.instanceType,
  volumeId: "",
  addedInstanceTags: [],
  deletedInstanceTags: [],
  servicePassword: "",
  publicKey: {
    name: "",
    key: "",
  },
  savePublicKey: false,
};

const currEditState: EditSpawnHostMutationVariables = {
  hostId: host.id,
  displayName: "new-display-name",
  expiration: null,
  noExpiration: host.noExpiration,
  instanceType: "new-instance-type",
  volumeId: "",
  addedInstanceTags: [
    { key: "a", value: " b" },
    { key: "c", value: " d" },
  ],
  deletedInstanceTags: [],
  servicePassword: "rdp-password",
  publicKey: {
    name: "newKeyName",
    key: "newKey",
  },
  savePublicKey: false,
};
