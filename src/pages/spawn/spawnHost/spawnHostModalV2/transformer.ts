import { validateTask } from "components/Spawn/utils";
import { GetMyPublicKeysQuery, GetSpawnTaskQuery } from "gql/generated/types";
import { stripNewLines } from "utils/string";
import { DEFAULT_VOLUME_SIZE } from "./consts";

interface Props {
  formData: any;
  publicKeys: GetMyPublicKeysQuery["myPublicKeys"];
  spawnTaskData: GetSpawnTaskQuery["task"];
}
export const formToGql = ({ formData, publicKeys, spawnTaskData }: Props) => {
  const {
    expirationDetails,
    homeVolumeDetails,
    publicKeySection,
    region,
    userdataScriptSection,
    loadData,
    distro,
  } = formData || {};
  const isVirtualWorkStation = !!distro?.isVirtualWorkstation;
  return {
    isVirtualWorkStation,
    userDataScript: userdataScriptSection.runUserdataScript
      ? userdataScriptSection.userdataScript
      : null,
    expiration: !expirationDetails.noExpiration
      ? expirationDetails.expiration
      : "",
    noExpiration: expirationDetails.noExpiration,
    volumeId:
      isVirtualWorkStation && homeVolumeDetails.selectExistingVolume
        ? homeVolumeDetails.volumeSelect
        : null,
    homeVolumeSize:
      isVirtualWorkStation &&
      (!homeVolumeDetails.selectExistingVolume ||
        !homeVolumeDetails.volumeSelect)
        ? homeVolumeDetails.volumeSize || DEFAULT_VOLUME_SIZE
        : null,
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
    spawnHostsStartedByTask: !!(
      loadData?.loadDataOntoHostAtStartup && loadData?.startHosts
    ),
    taskSync: !!(loadData?.loadDataOntoHostAtStartup && loadData?.taskSync),
  };
};
