import { prepareSpawnHostMutationVariables } from "./utils";

describe("prepareSpawnHostMutationVariables", () => {
  test("Preserves all necessary fields if they are supplied", () => {
    const hostDetailsState = {
      hasUserDataScript: true,
      userDataScript: `echo "hello world"`,
      noExpiration: false,
      expiration: null,
      volumeId: "",
      isVirtualWorkStation: false,
      homeVolumeSize: null,
    };
    const publicKeyState = {
      publicKey: {
        name: "Testkey.pub",
        key: "ssh-key",
      },
      savePublicKey: true,
    };
    const awsRegion = "us-east-1";
    const distro = "Not-A-Real-Distro";
    expect(
      prepareSpawnHostMutationVariables({
        hostDetailsState,
        publicKeyState,
        awsRegion,
        distro,
      })
    ).toStrictEqual({
      distroId: "Not-A-Real-Distro",
      expiration: null,
      isVirtualWorkStation: false,
      noExpiration: false,
      publicKey: { key: "ssh-key", name: "Testkey.pub" },
      region: "us-east-1",
      savePublicKey: true,
      userDataScript: 'echo "hello world"',
    });
  });
  test("Removes Unsupplied fields", () => {
    const hostDetailsState = {
      hasUserDataScript: false,
      userDataScript: `echo "hello world"`,
      noExpiration: false,
      expiration: null,
      volumeId: "",
      isVirtualWorkStation: false,
      homeVolumeSize: null,
    };
    const publicKeyState = {
      publicKey: {
        name: "Testkey.pub",
        key: "ssh-key",
      },
      savePublicKey: true,
    };
    const awsRegion = "us-east-1";
    const distro = "Not-A-Real-Distro";
    expect(
      prepareSpawnHostMutationVariables({
        hostDetailsState,
        publicKeyState,
        awsRegion,
        distro,
      })
    ).toStrictEqual({
      distroId: "Not-A-Real-Distro",
      expiration: null,
      isVirtualWorkStation: false,
      noExpiration: false,
      publicKey: { key: "ssh-key", name: "Testkey.pub" },
      region: "us-east-1",
      savePublicKey: true,
    });
  });
  test("Removes the userDataScript if the user opts not to include it", () => {
    const hostDetailsState = {
      hasUserDataScript: false,
      userDataScript: `echo "hello world"`,
      noExpiration: false,
      expiration: null,
      volumeId: "",
      isVirtualWorkStation: false,
      homeVolumeSize: null,
    };
    const publicKeyState = {
      publicKey: {
        name: "Testkey.pub",
        key: "ssh-key",
      },
      savePublicKey: true,
    };
    const awsRegion = "us-east-1";
    const distro = "Not-A-Real-Distro";
    expect(
      prepareSpawnHostMutationVariables({
        hostDetailsState,
        publicKeyState,
        awsRegion,
        distro,
      })
    ).toStrictEqual({
      distroId: "Not-A-Real-Distro",
      expiration: null,
      isVirtualWorkStation: false,
      noExpiration: false,
      publicKey: { key: "ssh-key", name: "Testkey.pub" },
      region: "us-east-1",
      savePublicKey: true,
    });
  });
});
