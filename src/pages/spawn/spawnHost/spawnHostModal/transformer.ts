import {
  GetMyPublicKeysQuery,
  GetSpawnTaskQuery,
  SpawnHostMutationVariables,
} from "gql/generated/types";
import { stripNewLines } from "utils/string";
import { DEFAULT_VOLUME_SIZE } from "./constants";
import { FormState } from "./types";
import { validateTask } from "./utils";

interface Props {
  formData: FormState;
  publicKeys: GetMyPublicKeysQuery["myPublicKeys"];
  spawnTaskData: GetSpawnTaskQuery["task"];
  migrateVolumeId?: string;
}
export const formToGql = ({
  formData,
  publicKeys,
  spawnTaskData,
  migrateVolumeId,
}: Props): SpawnHostMutationVariables["SpawnHostInput"] => {
  const {
    expirationDetails,
    homeVolumeDetails,
    publicKeySection,
    region,
    userdataScriptSection,
    loadData,
    distro,
    setupScriptSection,
  } = formData || {};
  const isVirtualWorkStation = !!distro?.isVirtualWorkstation;
  return {
    isVirtualWorkStation,
    userDataScript: userdataScriptSection?.runUserdataScript
      ? userdataScriptSection.userdataScript
      : null,
    expiration: expirationDetails?.noExpiration
      ? null
      : new Date(expirationDetails?.expiration),
    noExpiration: expirationDetails?.noExpiration,
    volumeId:
      migrateVolumeId ||
      (isVirtualWorkStation && homeVolumeDetails?.selectExistingVolume
        ? homeVolumeDetails.volumeSelect
        : null),
    homeVolumeSize:
      !migrateVolumeId &&
      isVirtualWorkStation &&
      (!homeVolumeDetails?.selectExistingVolume ||
        !homeVolumeDetails?.volumeSelect)
        ? homeVolumeDetails.volumeSize || DEFAULT_VOLUME_SIZE
        : null,
    publicKey: {
      name: publicKeySection?.useExisting
        ? publicKeySection?.publicKeyNameDropdown
        : publicKeySection?.newPublicKeyName,
      key: publicKeySection?.useExisting
        ? publicKeys.find(
            ({ name }) => name === publicKeySection?.publicKeyNameDropdown
          )?.key
        : stripNewLines(publicKeySection.newPublicKey),
    },
    savePublicKey:
      !publicKeySection?.useExisting && publicKeySection?.savePublicKey,
    distroId: distro?.value,
    region,
    taskId:
      loadData?.loadDataOntoHostAtStartup && validateTask(spawnTaskData)
        ? spawnTaskData.id
        : null,
    useProjectSetupScript: !!(
      loadData?.loadDataOntoHostAtStartup &&
      loadData?.runProjectSpecificSetupScript
    ),
    setUpScript: setupScriptSection?.defineSetupScriptCheckbox
      ? setupScriptSection?.setupScript
      : null,
    spawnHostsStartedByTask: !!(
      loadData?.loadDataOntoHostAtStartup && loadData?.startHosts
    ),
    taskSync: !!(loadData?.loadDataOntoHostAtStartup && loadData?.taskSync),
  };
};
