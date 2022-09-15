import { stripNewLines } from "utils/string";

export const formToGql = (formData, publicKeys) => {
  const { publicKeySection, expirationDetails, userdataScriptSection } =
    formData || {};
  return {
    userDataScript: userdataScriptSection.runUserdataScript
      ? userdataScriptSection.userdataScript
      : "",
    expiration: expirationDetails.noExpiration
      ? expirationDetails.expiration
      : "",
    noExpiration: expirationDetails.noExpiration,
    volumeId: null,
    isVirtualWorkStation: false,
    homeVolumeSize: null,
    publicKey: {
      name: publicKeySection.useExisting
        ? publicKeySection.publicKeyNameDropdown
        : publicKeySection.newPublicKeyName,
      key: publicKeySection.useExisting
        ? publicKeys.find(
            ({ name }) => name === publicKeySection.publicKeyNameDropdown
          )?.key
        : stripNewLines(publicKeySection.newPublicKey),
    },
    savePublicKey:
      !publicKeySection.useExisting && publicKeySection.savePublicKey,
    distroId: "amazon1-2018-large",
    region: "eu-west-1",
    taskId: null,
    useProjectSetupScript: false,
    spawnHostsStartedByTask: false,
    taskSync: false,
  };
};
