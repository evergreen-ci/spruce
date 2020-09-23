import { SpawnHostInput } from "gql/generated/types";
import { omitTypename } from "utils/string";
import { hostDetailsStateType } from "./HostDetailsForm";
import { publicKeyStateType } from "./PublicKeyForm";

export const prepareSpawnHostMutationVariables = ({
  hostDetailsState,
  distro,
  awsRegion,
  publicKeyState,
}: {
  hostDetailsState: hostDetailsStateType;
  distro: string;
  awsRegion: string;
  publicKeyState: publicKeyStateType;
}): SpawnHostInput => {
  // Build out the mutationVariables
  const hostDetails = {
    ...hostDetailsState,
  };
  // Remove unnecessary fields from mutation
  if (!hostDetails.hasUserDataScript) {
    delete hostDetails.userDataScript;
  }
  if (hostDetails.volumeId === "") {
    delete hostDetails.volumeId;
  }
  if (hostDetails.homeVolumeSize === null) {
    delete hostDetails.homeVolumeSize;
  }
  delete hostDetails.hasUserDataScript;

  const result: SpawnHostInput = {
    ...hostDetails,
    ...omitTypename(publicKeyState),
    distroId: distro,
    region: awsRegion,
  };
  return result;
};
