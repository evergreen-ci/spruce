export type FormState = {
  distro?: {
    value: string;
    isVirtualWorkstation: boolean;
  };
  region?: string;
  publicKeySection?: {
    useExisting: boolean;
    newPublicKey?: string;
    publicKeyNameDropdown?: string;
    savePublicKey?: boolean;
    newPublicKeyName?: string;
  };
  userdataScriptSection?: {
    runUserdataScript: boolean;
    userdataScript?: string;
  };
  setupScriptSection?: {
    defineSetupScriptCheckbox: boolean;
    setupScript?: string;
  };
  expirationDetails?: {
    noExpiration: boolean;
    expiration?: string;
  };
  homeVolumeDetails?: {
    selectExistingVolume: boolean;
    volumeSize?: number;
    volumeSelect?: string;
  };
  loadData?: {
    loadDataOntoHostAtStartup: boolean;
    runProjectSpecificSetupScript?: boolean;
    taskSync?: boolean;
    startHosts?: boolean;
  };
};
