import { SpawnTaskQuery } from "gql/generated/types";
import { FormState } from "./types";

export const validateTask = (taskData: SpawnTaskQuery["task"]) => {
  const {
    buildVariant,
    displayName: taskDisplayName,
    revision,
  } = taskData || {};
  return taskDisplayName && buildVariant && revision;
};

export const validateSpawnHostForm = (
  {
    distro,
    expirationDetails,
    homeVolumeDetails,
    publicKeySection,
    region,
    setupScriptSection,
    userdataScriptSection,
  }: FormState,
  isMigration?: boolean,
) => {
  const hasDistro = !!distro?.value;
  const hasRegion = !!region;
  const hasPublicKey = publicKeySection?.useExisting
    ? !!publicKeySection?.publicKeyNameDropdown
    : !!publicKeySection?.newPublicKey;
  const hasValidPublicKeyName = publicKeySection?.savePublicKey
    ? !!publicKeySection?.newPublicKeyName
    : true;
  const hasValidUserdataScript = userdataScriptSection?.runUserdataScript
    ? !!userdataScriptSection?.userdataScript
    : true;
  const hasValidSetupScript = setupScriptSection?.defineSetupScriptCheckbox
    ? !!setupScriptSection?.setupScript
    : true;
  const hasValidHomeVolumeDetails =
    isMigration ||
    (homeVolumeDetails?.selectExistingVolume
      ? !!homeVolumeDetails?.volumeSelect
      : !!homeVolumeDetails?.volumeSize);
  const hasValidExpiration = expirationDetails?.noExpiration
    ? true
    : !!expirationDetails?.expiration;

  return (
    hasDistro &&
    hasRegion &&
    hasPublicKey &&
    hasValidPublicKeyName &&
    hasValidUserdataScript &&
    hasValidSetupScript &&
    (distro?.isVirtualWorkstation ? hasValidHomeVolumeDetails : true) &&
    hasValidExpiration
  );
};
