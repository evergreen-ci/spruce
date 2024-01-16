import { formToGql } from "./transformer";

describe("spawn host modal", () => {
  it("correctly converts from a form to GQL", () => {
    data.forEach(({ formData, mutationInput }) => {
      expect(
        formToGql({
          formData,
          myPublicKeys,
          spawnTaskData: null,
        }),
      ).toStrictEqual(mutationInput);
    });
  });
  it("migrate volume id should be reflected in the gql output when supplied", () => {
    const migrateVolumeId = "some_volume";
    data.forEach(({ formData, mutationInput }) => {
      expect(
        formToGql({
          formData,
          myPublicKeys,
          spawnTaskData: null,
          migrateVolumeId,
        }),
      ).toStrictEqual({
        ...mutationInput,
        volumeId: migrateVolumeId,
        homeVolumeSize: null,
      });
    });
  });
  const myPublicKeys = [{ name: "a_key", key: "key value" }];
  const data = [
    {
      formData: {
        distro: {
          value: "ubuntu1804-workstation",
          isVirtualWorkstation: true,
        },
        region: "us-east-1",
        publicKeySection: {
          useExisting: false,
          newPublicKey: "blah blahsart",
          publicKeyNameDropdown:
            "a loooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooong name",
          savePublicKey: true,
          newPublicKeyName: "a name woo",
        },
        userdataScriptSection: {
          runUserdataScript: true,
          userdataScript: "a user data script",
        },
        setupScriptSection: {
          defineSetupScriptCheckbox: true,
          setupScript: "setup!!!",
        },
        expirationDetails: {
          noExpiration: false,
          expiration:
            "Thu Dec 08 2022 14:52:51 GMT-0500 (Eastern Standard Time)",
        },
        homeVolumeDetails: {
          selectExistingVolume: false,
          volumeSize: 504,
          volumeSelect: "",
        },
      },
      mutationInput: {
        isVirtualWorkStation: true,
        userDataScript: "a user data script",
        expiration: new Date("2022-12-08T19:52:51.000Z"),
        noExpiration: false,
        volumeId: null,
        homeVolumeSize: 504,
        publicKey: {
          name: "a name woo",
          key: "blah blahsart",
        },
        savePublicKey: true,
        distroId: "ubuntu1804-workstation",
        region: "us-east-1",
        taskId: null,
        useProjectSetupScript: false,
        setUpScript: "setup!!!",
        spawnHostsStartedByTask: false,
        taskSync: false,
      },
    },
    {
      formData: {
        distro: { value: "rhel71-power8-large", isVirtualWorkstation: false },
        region: "rofl-east",
        publicKeySection: {
          useExisting: true,
          publicKeyNameDropdown: "a_key",
          newPublicKey: "",
        },
        userdataScriptSection: { runUserdataScript: false },
        setupScriptSection: { defineSetupScriptCheckbox: false },
        expirationDetails: {
          noExpiration: true,
          expiration:
            "Wed Oct 19 2022 08:56:42 GMT-0400 (Eastern Daylight Time)",
        },
        homeVolumeDetails: { selectExistingVolume: true, volumeSelect: "" },
      },
      mutationInput: {
        isVirtualWorkStation: false,
        userDataScript: null,
        expiration: null,
        noExpiration: true,
        volumeId: null,
        homeVolumeSize: null,
        publicKey: {
          key: "key value",
          name: "a_key",
        },
        savePublicKey: false,
        distroId: "rhel71-power8-large",
        region: "rofl-east",
        taskId: null,
        useProjectSetupScript: false,
        setUpScript: null,
        spawnHostsStartedByTask: false,
        taskSync: false,
      },
    },
  ];
});
