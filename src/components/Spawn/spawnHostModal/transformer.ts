import {
  MyPublicKeysQuery,
  SpawnTaskQuery,
  SpawnHostMutationVariables,
} from "gql/generated/types";
import { stripNewLines } from "utils/string";
import { DEFAULT_VOLUME_SIZE } from "./constants";
import { FormState } from "./types";
import { validateTask } from "./utils";

interface Props {
  formData: FormState;
  myPublicKeys: MyPublicKeysQuery["myPublicKeys"];
  spawnTaskData?: SpawnTaskQuery["task"];
  migrateVolumeId?: string;
}
export const formToGql = ({
  formData,
  migrateVolumeId,
  myPublicKeys,
  spawnTaskData,
}: Props): SpawnHostMutationVariables["spawnHostInput"] => {
  const {
    distro,
    expirationDetails,
    homeVolumeDetails,
    loadData,
    publicKeySection,
    region,
    setupScriptSection,
    userdataScriptSection,
  } = formData || {};
  const isVirtualWorkStation = !!distro?.isVirtualWorkstation;
  return {
    distroId: distro?.value,
    expiration: expirationDetails?.noExpiration
      ? null
      : new Date(expirationDetails?.expiration),
    homeVolumeSize:
      !migrateVolumeId &&
      isVirtualWorkStation &&
      (!homeVolumeDetails?.selectExistingVolume ||
        !homeVolumeDetails?.volumeSelect)
        ? homeVolumeDetails.volumeSize || DEFAULT_VOLUME_SIZE
        : null,
    isVirtualWorkStation,
    noExpiration: expirationDetails?.noExpiration,
    publicKey: {
      key: publicKeySection?.useExisting
        ? myPublicKeys.find(
            ({ name }) => name === publicKeySection?.publicKeyNameDropdown
          )?.key
        : stripNewLines(publicKeySection.newPublicKey),
      name: publicKeySection?.useExisting
        ? publicKeySection?.publicKeyNameDropdown
        : publicKeySection?.newPublicKeyName ?? "",
    },
    region,
    savePublicKey:
      !publicKeySection?.useExisting && !!publicKeySection?.savePublicKey,
    setUpScript: setupScriptSection?.defineSetupScriptCheckbox
      ? setupScriptSection?.setupScript
      : null,
    spawnHostsStartedByTask: !!(
      loadData?.loadDataOntoHostAtStartup && loadData?.startHosts
    ),
    taskId:
      loadData?.loadDataOntoHostAtStartup && validateTask(spawnTaskData)
        ? spawnTaskData.id
        : null,
    taskSync: !!(loadData?.loadDataOntoHostAtStartup && loadData?.taskSync),
    useProjectSetupScript: !!(
      loadData?.loadDataOntoHostAtStartup &&
      loadData?.runProjectSpecificSetupScript
    ),
    userDataScript: userdataScriptSection?.runUserdataScript
      ? userdataScriptSection.userdataScript
      : null,
    volumeId:
      migrateVolumeId ||
      (isVirtualWorkStation && homeVolumeDetails?.selectExistingVolume
        ? homeVolumeDetails.volumeSelect
        : null),
  };
};
