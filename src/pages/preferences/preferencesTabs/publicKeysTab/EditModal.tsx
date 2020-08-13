import React, { useState, useEffect } from "react";
import { Modal } from "components/Modal";
import { useMutation } from "@apollo/react-hooks";
import styled from "@emotion/styled";
import Button, { Variant } from "@leafygreen-ui/button";
import {
  GetMyPublicKeysQuery,
  UpdatePublicKeyMutation,
  UpdatePublicKeyMutationVariables,
  GetMyPublicKeysQueryVariables,
  CreatePublicKeyMutation,
  CreatePublicKeyMutationVariables,
} from "gql/generated/types";
import { GET_MY_PUBLIC_KEYS } from "gql/queries";
import { UPDATE_PUBLIC_KEY } from "gql/mutations/update-public-key";
import { useBannerDispatchContext } from "context/banners";

export interface Props {
  replaceKeyName?: string;
  initialKeyName?: string;
  initialKeyValue?: string;
  visible: boolean;
  onCancel: () => void;
}

export const EditModal: React.FC<Props> = ({
  replaceKeyName,
  initialKeyName,
  initialKeyValue,
  visible,
  onCancel,
}) => {
  const dispatchBanner = useBannerDispatchContext();
  const [updatePublicKey, { loading: loadingUpdatePublicKey }] = useMutation<
    UpdatePublicKeyMutation,
    UpdatePublicKeyMutationVariables
  >(UPDATE_PUBLIC_KEY, {
    onError(error) {
      dispatchBanner.errorBanner(
        `There was an error editing the public key: ${error.message}`
      );
    },
    update(cache, { data }) {
      cache.writeQuery<GetMyPublicKeysQuery, GetMyPublicKeysQueryVariables>({
        query: GET_MY_PUBLIC_KEYS,
        data: { myPublicKeys: [...data.updatePublicKey] },
      });
    },
  });
  const [createPublicKey, { loading: loadingCreatePublicKey }] = useMutation<
    CreatePublicKeyMutation,
    CreatePublicKeyMutationVariables
  >(UPDATE_PUBLIC_KEY, {
    onError(error) {
      dispatchBanner.errorBanner(
        `There was an error creating the public key: ${error.message}`
      );
    },
    update(cache, { data }) {
      cache.writeQuery<GetMyPublicKeysQuery, GetMyPublicKeysQueryVariables>({
        query: GET_MY_PUBLIC_KEYS,
        data: { myPublicKeys: [...data.createPublicKey] },
      });
    },
  });

  const [keyName, setKeyName] = useState(initialKeyName ?? "");
  const [keyValue, setKeyValue] = useState(initialKeyValue ?? "");

  useEffect(() => {
    setKeyName(initialKeyName);
    setKeyValue(initialKeyValue);
  }, [initialKeyName, initialKeyValue]);

  const modalTitle = replaceKeyName ? "Update Public Key" : "Add Public Key";

  const isFormValid = true;
  const onClickSave = () => {
    const nextKeyInfo = { name: keyName, key: keyValue };
    replaceKeyName
      ? updatePublicKey({
          variables: { targetKeyName: replaceKeyName, updateInfo: nextKeyInfo },
        })
      : createPublicKey({ variables: { publicKeyInput: nextKeyInfo } });
  };

  return (
    <Modal
      data-cy="key-edit-modal"
      visible={visible}
      onCancel={onCancel}
      footer={
        <>
          <LeftButton
            key="cancel"
            onClick={onCancel}
            data-cy="cancel-subscription-button"
          >
            Cancel
          </LeftButton>
          <Button
            key="save"
            data-cy="save-subscription-button"
            disabled={!isFormValid}
            onClick={onClickSave}
            variant={Variant.Primary}
          >
            Save
          </Button>
        </>
      }
      title={modalTitle}
    />
  );
};

const LeftButton = styled(Button)`
  margin-right: 16px;
`;
