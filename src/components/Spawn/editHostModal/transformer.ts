import {
  MyPublicKeysQuery,
  EditSpawnHostMutationVariables,
} from "gql/generated/types";
import { string } from "utils";
import { FormState } from "./types";

const { stripNewLines } = string;

interface Props {
  hostId: string;
  myPublicKeys: MyPublicKeysQuery["myPublicKeys"];
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
    expirationDetails,
    hostName,
    instanceType,
    publicKeySection,
    rdpPassword,
    userTags: newUserTags,
    volume,
  } = formData || {};

  const { expiration, noExpiration } = expirationDetails;
  const {
    newPublicKey = "",
    newPublicKeyName = "",
    publicKeyNameDropdown = "",
    savePublicKey = false,
    useExisting,
  } = publicKeySection;

  const addedTags = newUserTags.filter((n) =>
    oldUserTags.every((o) => n.key !== o.key || n.value !== o.value)
  );
  const deletedTags = oldUserTags.filter((o) =>
    newUserTags.every((n) => n.key !== o.key || n.value !== o.value)
  );

  return {
    addedInstanceTags: addedTags,
    deletedInstanceTags: deletedTags,
    displayName: hostName,
    expiration: noExpiration ? null : new Date(expiration),
    hostId,
    instanceType,
    noExpiration,
    publicKey: {
      key: useExisting
        ? (
            myPublicKeys.find(({ name }) => name === publicKeyNameDropdown) ?? {
              key: "",
            }
          ).key
        : stripNewLines(newPublicKey),
      name: useExisting ? publicKeyNameDropdown : newPublicKeyName,
    },
    savePublicKey: !useExisting && savePublicKey,
    servicePassword: rdpPassword,
    volumeId: volume,
  };
};
