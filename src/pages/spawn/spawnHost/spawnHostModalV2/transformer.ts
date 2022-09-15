import { validateTask } from "components/Spawn/utils";
import { GetSpawnTaskQuery } from "gql/generated/types";
import { stripNewLines } from "utils/string";
import { DEFAULT_VOLUME_SIZE } from "./consts";

interface Props {
  distroId: string;
  formData: any;
  isVirtualWorkStation: boolean;
  publicKeys: any;
  spawnTaskData: GetSpawnTaskQuery["task"];
}
export const formToGql = ({
  distroId,
  formData,
  isVirtualWorkStation,
  publicKeys,
  spawnTaskData,
}: Props) => {
  const {
    expirationDetails,
    homeVolumeDetails,
    publicKeySection,
    region,
    userdataScriptSection,
    loadData,
  } = formData || {};

  return {
    userDataScript: userdataScriptSection.runUserdataScript
      ? userdataScriptSection.userdataScript
      : null,
    expiration: expirationDetails.noExpiration
      ? expirationDetails.expiration
      : "",
    noExpiration: expirationDetails.noExpiration,
    ...(homeVolumeDetails.selectExistingVolume && {
      volumeId: homeVolumeDetails.volumeSelect,
    }),
    ...(!homeVolumeDetails.selectExistingVolume && {
      homeVolumeSize: DEFAULT_VOLUME_SIZE,
    }),
    isVirtualWorkStation,
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
    distroId,
    region,
    taskId:
      loadData.loadDataOntoHostAtStartup && validateTask(spawnTaskData)
        ? spawnTaskData.id
        : null,
    useProjectSetupScript:
      loadData.loadDataOntoHostAtStartup &&
      loadData.runProjectSpecificSetupScript,
    spawnHostsStartedByTask:
      loadData.loadDataOntoHostAtStartup && loadData.startHosts,
    taskSync: loadData.loadDataOntoHostAtStartup && loadData.taskSync,
  };
};
