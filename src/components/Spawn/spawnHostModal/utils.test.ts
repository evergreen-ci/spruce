import { FormState } from "./types";
import { validateSpawnHostForm } from "./utils";

describe("validateSpawnHostForm", () => {
  it("a valid form will return true", () => {
    expect(validateSpawnHostForm(validForm)).toBe(true);
  });
  it("an empty form will return false", () => {
    expect(validateSpawnHostForm({})).toBe(false);
  });
  it("a home volume name or size must be provided after selecting a virtual workstation distro when not migrating a volume", () => {
    expect(validateSpawnHostForm(validVirtualWorkstationForm)).toBe(true);
    expect(
      validateSpawnHostForm({
        ...validVirtualWorkstationForm,
        homeVolumeDetails: { selectExistingVolume: true, volumeSelect: "" },
      })
    ).toBe(false);
    expect(
      validateSpawnHostForm({
        ...validVirtualWorkstationForm,
        homeVolumeDetails: { selectExistingVolume: false, volumeSize: 0 },
      })
    ).toBe(false);
    expect(
      validateSpawnHostForm({
        ...validVirtualWorkstationForm,
        homeVolumeDetails: { selectExistingVolume: false, volumeSize: 1 },
      })
    ).toBe(true);
  });
  it("home volume inputs are not required when migrating a volume", () => {
    expect(
      validateSpawnHostForm(
        {
          ...validVirtualWorkstationForm,
          homeVolumeDetails: { selectExistingVolume: true, volumeSelect: "" },
        },
        true
      )
    ).toBe(true);
    expect(
      validateSpawnHostForm(
        {
          ...validVirtualWorkstationForm,
          homeVolumeDetails: { selectExistingVolume: false, volumeSize: 0 },
        },
        true
      )
    ).toBe(true);
    expect(
      validateSpawnHostForm(
        {
          ...validVirtualWorkstationForm,
          homeVolumeDetails: { selectExistingVolume: false, volumeSize: 1 },
        },
        true
      )
    ).toBe(true);
  });
  it("an empty distro will not pass validation", () => {
    expect(
      validateSpawnHostForm({
        ...validForm,
        distro: { isVirtualWorkstation: false, value: "" },
      })
    ).toBe(false);
  });
  it("an empty region will not pass validation", () => {
    expect(
      validateSpawnHostForm({
        ...validForm,
        region: "",
      })
    ).toBe(false);
  });
  it("a public key name or public key value must be provided", () => {
    expect(
      validateSpawnHostForm({
        ...validForm,
        publicKeySection: { publicKeyNameDropdown: "", useExisting: true },
      })
    ).toBe(false);
    expect(
      validateSpawnHostForm({
        ...validForm,
        publicKeySection: { newPublicKey: "", useExisting: false },
      })
    ).toBe(false);
    expect(
      validateSpawnHostForm({
        ...validForm,
        publicKeySection: {
          publicKeyNameDropdown: "key val",
          useExisting: true,
        },
      })
    ).toBe(true);
    expect(
      validateSpawnHostForm({
        ...validForm,
        publicKeySection: { newPublicKey: "key val", useExisting: false },
      })
    ).toBe(true);
  });
  it("a public key name is required when 'Save Public Key' is checked", () => {
    expect(
      validateSpawnHostForm({
        ...validForm,
        publicKeySection: {
          newPublicKey: "ssh-rsa new-key",
          newPublicKeyName: "new key",
          savePublicKey: true,
          useExisting: false,
        },
      })
    ).toBe(true);
    expect(
      validateSpawnHostForm({
        ...validForm,
        publicKeySection: {
          newPublicKey: "ssh-rsa new-key",
          savePublicKey: true,
          useExisting: false,
        },
      })
    ).toBe(false);
  });
  it("a user data script must be provided when the option is selected", () => {
    expect(
      validateSpawnHostForm({
        ...validForm,
        userdataScriptSection: {
          runUserdataScript: true,
          userdataScript: "",
        },
      })
    ).toBe(false);
    expect(
      validateSpawnHostForm({
        ...validForm,
        userdataScriptSection: {
          runUserdataScript: true,
          userdataScript: "abc",
        },
      })
    ).toBe(true);
  });
  it("a setup script must be provided when the option is selected", () => {
    expect(
      validateSpawnHostForm({
        ...validForm,
        setupScriptSection: {
          defineSetupScriptCheckbox: true,
          setupScript: "abc123",
        },
      })
    ).toBe(true);
    expect(
      validateSpawnHostForm({
        ...validForm,
        setupScriptSection: {
          defineSetupScriptCheckbox: true,
          setupScript: "",
        },
      })
    ).toBe(false);
  });
  it("an expiration is required when 'Never expire' is not selected", () => {
    expect(
      validateSpawnHostForm({
        ...validForm,
        expirationDetails: {
          expiration: "2022-10-11T22:08:02.000Z",
          noExpiration: false,
        },
      })
    ).toBe(true);
    expect(
      validateSpawnHostForm({
        ...validForm,
        expirationDetails: {
          expiration: "",
          noExpiration: false,
        },
      })
    ).toBe(false);
  });
});

const validForm: FormState = {
  distro: { isVirtualWorkstation: true, value: "ubuntu-workstation" },
  expirationDetails: {
    noExpiration: true,
  },
  homeVolumeDetails: {
    selectExistingVolume: true,
    volumeSelect: "a volume",
  },
  publicKeySection: {
    publicKeyNameDropdown: "cool key",
    useExisting: true,
  },
  region: "us-east-1a",
};
const validVirtualWorkstationForm: FormState = {
  distro: { isVirtualWorkstation: true, value: "ubuntu-workstation" },
  expirationDetails: {
    noExpiration: true,
  },
  homeVolumeDetails: {
    selectExistingVolume: true,
    volumeSelect: "a volume",
  },
  publicKeySection: {
    publicKeyNameDropdown: "cool key",
    useExisting: true,
  },
  region: "us-east-1a",
};
