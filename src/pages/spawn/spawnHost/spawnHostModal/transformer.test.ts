import { formToGql } from "./transformer";

describe("repo data", () => {
  it("correctly converts from a form to GQL", () => {
    expect(
      formToGql({
        formData: data.formData,
        publicKeys: [],
        spawnTaskData: null,
      })
    ).toStrictEqual(data.mutationInput);
  });
  const data = {
    formData: {
      distro: {
        value: "ubuntu1804-workstation",
        isVirtualWorkstation: true,
      },
      region: "rofl-east",
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
        expiration: "Thu Dec 08 2022 14:52:51 GMT-0500 (Eastern Standard Time)",
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
      region: "rofl-east",
      taskId: null,
      useProjectSetupScript: false,
      setUpScript: "setup!!!",
      spawnHostsStartedByTask: false,
      taskSync: false,
    },
  };
});
