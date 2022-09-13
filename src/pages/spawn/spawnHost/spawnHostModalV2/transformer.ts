export const formToGql = (formData, publicKeys) => {
  const { publicKeySection } = formData || {};
  return {
    userDataScript: null,
    expiration: "2022-09-20T12:39:03.816Z",
    noExpiration: false,
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
        : publicKeySection.newPublicKey,
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
