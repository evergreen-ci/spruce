import {
  GetMyPublicKeysQuery,
  EditSpawnHostMutationVariables,
} from "gql/generated/types";
import { string } from "utils";
import { FormState } from "./types";

const { stripNewLines } = string;

interface Props {
  hostId: string;
  myPublicKeys: GetMyPublicKeysQuery["myPublicKeys"];
  formData: FormState;
  oldUserTags: { key: string; value: string }[];
}
export const formToGql = ({
  formData,
  hostId,
  myPublicKeys,
  oldUserTags,
}: Props): EditSpawnHostMutationVariables => {
  const {
    hostName,
    expirationDetails,
    instanceType,
    volume,
    rdpPassword,
    userTags: newUserTags,
    publicKeySection,
  } = formData || {};

  const { noExpiration, expiration } = expirationDetails;
  const {
    useExisting,
    publicKeyNameDropdown = "",
    newPublicKey,
    newPublicKeyName = "",
    savePublicKey = false,
  } = publicKeySection;

  const addedTags = newUserTags.filter((n) =>
    oldUserTags.every((o) => n.key !== o.key || n.value !== o.value)
  );
  const deletedTags = oldUserTags.filter((o) =>
    newUserTags.every((n) => n.key !== o.key || n.value !== o.value)
  );

  return {
    hostId,
    displayName: hostName,
    volumeId: volume,
    instanceType,
    addedInstanceTags: addedTags,
    deletedInstanceTags: deletedTags,
    expiration: noExpiration ? null : new Date(expiration),
    noExpiration,
    servicePassword: rdpPassword,
    publicKey: {
      name: useExisting ? publicKeyNameDropdown : newPublicKeyName,
      key: useExisting
        ? myPublicKeys.find(({ name }) => name === publicKeyNameDropdown)
            ?.key ?? ""
        : stripNewLines(newPublicKey),
    },
    savePublicKey: !useExisting && savePublicKey,
  };
};
