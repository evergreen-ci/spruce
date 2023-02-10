import { SpawnVolumeMutationVariables } from "gql/generated/types";
import { FormState } from "./types";

interface Props {
  formData: FormState;
}
export const formToGql = ({
  formData,
}: Props): SpawnVolumeMutationVariables["SpawnVolumeInput"] => {
  const { requiredVolumeInformation, optionalVolumeInformation } =
    formData || {};

  const { volumeSize, availabilityZone, type } =
    requiredVolumeInformation || {};

  const { expirationDetails, mountToHost } = optionalVolumeInformation || {};
  const { expiration, noExpiration } = expirationDetails || {};

  return {
    availabilityZone,
    size: volumeSize,
    type,
    noExpiration,
    expiration: noExpiration ? null : new Date(expiration),
    host: mountToHost || null,
  };
};
