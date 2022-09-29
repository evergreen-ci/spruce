import { formToGql } from "./transformer";

describe("repo data", () => {
  it("correctly converts from a form to GQL", () => {
    data.forEach(({ formData, mutationInput }) => {
      expect(
        formToGql({
          formData,
          publicKeys: [{ name: "a_key", key: "key value" }],
          spawnTaskData: null,
        })
      ).toStrictEqual(mutationInput);
    });
  });
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
      formState: {
        distro: { value: "rhel71-power8-large", isVirtualWorkstation: false },
        region: "rofl-east",
        publicKeySection: {
          useExisting: true,
          publicKeyNameDropdown: "a_key",
          newPublicKey: "",
        },
        userdataScriptSection: { runUserdataScript: false, userdataScript: "" },
        setupScriptSection: {},
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
        expiration: "2022-10-19T12:56:42.000Z",
        noExpiration: false,
        volumeId: null,
        homeVolumeSize: null,
        publicKey: {
          name: "bKey",
          key: "ssh-rsa AAAAB3NzaC1yc2EAAAABIwAAAQEAklOUpkDHrfHY17SbrmTIpNLTGK9Tjom/BWDSUGPl+nafzlHDTYW7hdI4yZ5ew18JH4JW9jbhUFrviQzM7xlELEVf4h9lFX5QVkbPppSwg0cda3Pbv7kOdJ/MTyBlWXFCR+HAo3FXRitBqxiX1nKhXpHAZsMciLq8V6RjsNAQwdsdMFvSlVK/7XAt3FaoJoAsncM1Q9x5+3V0Ww68/eIFmb1zuUFljQJKprrX88XypNDvjYNby6vw/Pb0rwert/EnmZ+AW4OZPnTPI89ZPmVMLuayrD2cE86Z/il8b+gw3r3+1nKatmIkjn2so1d01QraTlMqVSsbxNrRFi9wrf+M7Q== schacon@mylaptop.local",
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
