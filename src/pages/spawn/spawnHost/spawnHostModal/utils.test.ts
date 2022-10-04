import { FormState } from "./types";
import { validateSpawnHostForm } from "./utils";

describe("validateSpawnHostForm", () => {
  it("a valid form will return true", () => {
    expect(validateSpawnHostForm(validForm)).toBe(true);
  });
  it("an empty form will return false", () => {
    expect(validateSpawnHostForm({})).toBe(false);
  });
  it("a home volume name or size must be provided after selecting a virtual workstation distro", () => {
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
  it("an empty distro will not pass validation", () => {
    expect(
      validateSpawnHostForm({
        ...validForm,
        distro: { value: "", isVirtualWorkstation: false },
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
        publicKeySection: { useExisting: true, publicKeyNameDropdown: "" },
      })
    ).toBe(false);
    expect(
      validateSpawnHostForm({
        ...validForm,
        publicKeySection: { useExisting: false, newPublicKey: "" },
      })
    ).toBe(false);
    expect(
      validateSpawnHostForm({
        ...validForm,
        publicKeySection: { useExisting: false, newPublicKey: "key val" },
      })
    ).toBe(true);
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
          noExpiration: false,
          expiration: "2022-10-11T22:08:02.000Z",
        },
      })
    ).toBe(true);
    expect(
      validateSpawnHostForm({
        ...validForm,
        expirationDetails: {
          noExpiration: false,
          expiration: "",
        },
      })
    ).toBe(false);
  });
});

const validForm: FormState = {
  distro: { value: "ubuntu-workstation", isVirtualWorkstation: true },
  region: "us-east-1a",
  publicKeySection: {
    useExisting: true,
    publicKeyNameDropdown: "cool key",
  },
  homeVolumeDetails: {
    selectExistingVolume: true,
    volumeSelect: "a volume",
  },
  expirationDetails: {
    noExpiration: true,
  },
};
const validVirtualWorkstationForm: FormState = {
  distro: { value: "ubuntu-workstation", isVirtualWorkstation: true },
  region: "us-east-1a",
  publicKeySection: {
    useExisting: true,
    publicKeyNameDropdown: "cool key",
  },
  homeVolumeDetails: {
    selectExistingVolume: true,
    volumeSelect: "a volume",
  },
  expirationDetails: {
    noExpiration: true,
  },
};
