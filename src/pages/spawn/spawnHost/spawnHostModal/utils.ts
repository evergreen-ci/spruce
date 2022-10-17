import { GetSpawnTaskQuery } from "gql/generated/types";
import { FormState } from "./types";

export const validateTask = (taskData: GetSpawnTaskQuery["task"]) => {
  const {
    displayName: taskDisplayName,
    buildVariant,
    revision,
  } = taskData || {};
  return taskDisplayName && buildVariant && revision;
};

export const validateSpawnHostForm = ({
  distro,
  region,
  publicKeySection,
  userdataScriptSection,
  setupScriptSection,
  homeVolumeDetails,
  expirationDetails,
}: FormState) => {
  const isValidHomeVolumeDetails = homeVolumeDetails?.selectExistingVolume
    ? !!homeVolumeDetails?.volumeSelect
    : !!homeVolumeDetails?.volumeSize;
  return (
    !!distro?.value &&
    !!region &&
    (publicKeySection?.useExisting
      ? !!publicKeySection?.publicKeyNameDropdown
      : !!publicKeySection?.newPublicKey) &&
    (userdataScriptSection?.runUserdataScript
      ? !!userdataScriptSection?.userdataScript
      : true) &&
    (setupScriptSection?.defineSetupScriptCheckbox
      ? !!setupScriptSection?.setupScript
      : true) &&
    (distro?.isVirtualWorkstation ? isValidHomeVolumeDetails : true) &&
    (expirationDetails?.noExpiration ? true : !!expirationDetails?.expiration)
  );
};
