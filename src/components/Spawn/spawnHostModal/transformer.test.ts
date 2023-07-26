import { formToGql } from "./transformer";

describe("spawn host modal", () => {
  it("correctly converts from a form to GQL", () => {
    data.forEach(({ formData, mutationInput }) => {
      expect(
        formToGql({
          formData,
          myPublicKeys,
          spawnTaskData: null,
        })
      ).toStrictEqual(mutationInput);
    });
  });
  it("migrate volume id should be reflected in the gql output when supplied", () => {
    const migrateVolumeId = "some_volume";
    data.forEach(({ formData, mutationInput }) => {
      expect(
        formToGql({
          formData,
          migrateVolumeId,
          myPublicKeys,
          spawnTaskData: null,
        })
      ).toStrictEqual({
        ...mutationInput,
        homeVolumeSize: null,
        volumeId: migrateVolumeId,
      });
    });
  });
  const myPublicKeys = [{ key: "key value", name: "a_key" }];
  const data = [
    {
      formData: {
        distro: {
          isVirtualWorkstation: true,
          value: "ubuntu1804-workstation",
        },
        expirationDetails: {
          expiration:
            "Thu Dec 08 2022 14:52:51 GMT-0500 (Eastern Standard Time)",
          noExpiration: false,
        },
        homeVolumeDetails: {
          selectExistingVolume: false,
          volumeSelect: "",
          volumeSize: 504,
        },
        publicKeySection: {
          newPublicKey: "blah blahsart",
          newPublicKeyName: "a name woo",
          publicKeyNameDropdown:
            "a loooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooong name",
          savePublicKey: true,
          useExisting: false,
        },
        region: "us-east-1",
        setupScriptSection: {
          defineSetupScriptCheckbox: true,
          setupScript: "setup!!!",
        },
        userdataScriptSection: {
          runUserdataScript: true,
          userdataScript: "a user data script",
        },
      },
      mutationInput: {
        distroId: "ubuntu1804-workstation",
        expiration: new Date("2022-12-08T19:52:51.000Z"),
        homeVolumeSize: 504,
        isVirtualWorkStation: true,
        noExpiration: false,
        publicKey: {
          key: "blah blahsart",
          name: "a name woo",
        },
        region: "us-east-1",
        savePublicKey: true,
        setUpScript: "setup!!!",
        spawnHostsStartedByTask: false,
        taskId: null,
        taskSync: false,
        useProjectSetupScript: false,
        userDataScript: "a user data script",
        volumeId: null,
      },
    },
    {
      formData: {
        distro: { isVirtualWorkstation: false, value: "rhel71-power8-large" },
        expirationDetails: {
          expiration:
            "Wed Oct 19 2022 08:56:42 GMT-0400 (Eastern Daylight Time)",
          noExpiration: true,
        },
        homeVolumeDetails: { selectExistingVolume: true, volumeSelect: "" },
        publicKeySection: {
          newPublicKey: "",
          publicKeyNameDropdown: "a_key",
          useExisting: true,
        },
        region: "rofl-east",
        setupScriptSection: { defineSetupScriptCheckbox: false },
        userdataScriptSection: { runUserdataScript: false },
      },
      mutationInput: {
        distroId: "rhel71-power8-large",
        expiration: null,
        homeVolumeSize: null,
        isVirtualWorkStation: false,
        noExpiration: true,
        publicKey: {
          key: "key value",
          name: "a_key",
        },
        region: "rofl-east",
        savePublicKey: false,
        setUpScript: null,
        spawnHostsStartedByTask: false,
        taskId: null,
        taskSync: false,
        useProjectSetupScript: false,
        userDataScript: null,
        volumeId: null,
      },
    },
  ];
});
