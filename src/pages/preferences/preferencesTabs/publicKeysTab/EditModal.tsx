import React, { useState, useEffect } from "react";
import { Modal } from "components/Modal";
import { useMutation, useQuery } from "@apollo/react-hooks";
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
import { Input } from "antd";
import { CREATE_PUBLIC_KEY } from "gql/mutations/create-public-key";
import { InputLabel, ErrorMessage } from "components/styles";
import { v4 as uuid } from "uuid";

const { TextArea } = Input;

export interface EditModalPropsState {
  initialPublicKey?: { name: string; key: string }; // initialPublicKey is the key that will be updated in the db when provided
  visible: boolean;
}

interface EditModalProps extends EditModalPropsState {
  onCancel: () => void;
}

export const EditModal: React.FC<EditModalProps> = ({
  initialPublicKey,
  visible,
  onCancel,
}) => {
  const { data: myKeysData } = useQuery<
    GetMyPublicKeysQuery,
    GetMyPublicKeysQueryVariables
  >(GET_MY_PUBLIC_KEYS, { fetchPolicy: "cache-only" });
  const dispatchBanner = useBannerDispatchContext();
  const [errors, setErrors] = useState<string[]>([]);
  const [updatePublicKey] = useMutation<
    UpdatePublicKeyMutation,
    UpdatePublicKeyMutationVariables
  >(UPDATE_PUBLIC_KEY, {
    onError(error) {
      dispatchBanner.errorBanner(
        `There was an error editing the public key: ${error.message}`
      );
    },
    onCompleted() {
      dispatchBanner.clearAllBanners();
    },
    update(cache, { data }) {
      cache.writeQuery<GetMyPublicKeysQuery, GetMyPublicKeysQueryVariables>({
        query: GET_MY_PUBLIC_KEYS,
        data: { myPublicKeys: [...data.updatePublicKey] },
      });
    },
  });
  const [createPublicKey] = useMutation<
    CreatePublicKeyMutation,
    CreatePublicKeyMutationVariables
  >(CREATE_PUBLIC_KEY, {
    onError(error) {
      dispatchBanner.errorBanner(
        `There was an error creating the public key: ${error.message}`
      );
    },
    onCompleted() {
      dispatchBanner.clearAllBanners();
    },
    update(cache, { data }) {
      cache.writeQuery<GetMyPublicKeysQuery, GetMyPublicKeysQueryVariables>({
        query: GET_MY_PUBLIC_KEYS,
        data: { myPublicKeys: [...data.createPublicKey] },
      });
    },
  });

  const [keyName, setKeyName] = useState<string>();
  const [keyValue, setKeyValue] = useState<string>();

  // reset state with initial value
  useEffect(() => {
    setKeyName(initialPublicKey?.name ?? "");
    setKeyValue(initialPublicKey?.key ?? "");
  }, [initialPublicKey]);

  const replaceKeyName = initialPublicKey?.name;

  // form validation
  useEffect(() => {
    const inputErrors = [];
    if (!keyName) {
      inputErrors.push(EMPTY_KEY_NAME);
    }
    if (
      myKeysData?.myPublicKeys.find(({ name }) => name === keyName) &&
      keyName !== replaceKeyName
    ) {
      inputErrors.push(DUPLICATE_KEY_NAME);
    }
    const hasRSA = keyValue?.substring(0, SSH_RSA.length) === SSH_RSA;
    const hasDSS = keyValue?.substring(0, SSH_DSS.length) === SSH_DSS;
    if (!hasRSA && !hasDSS) {
      inputErrors.push(INVALID_SSH_KEY);
    }
    setErrors(inputErrors);
  }, [keyName, keyValue, replaceKeyName, myKeysData]);

  const closeModal = () => {
    onCancel();
    setKeyName("");
    setKeyValue("");
  };

  const onClickSave = () => {
    const nextKeyInfo = { name: keyName, key: keyValue };
    if (replaceKeyName) {
      updatePublicKey({
        variables: { targetKeyName: replaceKeyName, updateInfo: nextKeyInfo },
      });
    } else {
      createPublicKey({ variables: { publicKeyInput: nextKeyInfo } });
    }
    closeModal();
  };

  return (
    <Modal
      data-cy="key-edit-modal"
      visible={visible}
      onCancel={closeModal}
      footer={
        <>
          <LeftButton
            key="cancel"
            onClick={closeModal}
            data-cy="cancel-subscription-button"
          >
            Cancel
          </LeftButton>
          <Button
            key="save"
            data-cy="save-key-button"
            disabled={errors.length > 0}
            onClick={onClickSave}
            variant={Variant.Primary}
          >
            Save
          </Button>
        </>
      }
      title={replaceKeyName ? "Update Public Key" : "Add Public Key"}
    >
      <InputLabel>Key Name</InputLabel>
      <StyledInput
        value={keyName}
        onChange={(e) => {
          setKeyName(e.target.value);
        }}
        data-cy="key-name-input"
      />
      <InputLabel>Public Key</InputLabel>
      <TextArea
        data-cy="key-value-input"
        value={keyValue}
        autoSize={{ minRows: 4, maxRows: 6 }}
        onChange={(e) => setKeyValue(e.target.value)}
      />
      <ErrorContainer>
        {visible &&
          errors.map((text) => (
            <div key={uuid()} data-cy="error-message">
              <ErrorMessage>{text}</ErrorMessage>
            </div>
          ))}
      </ErrorContainer>
    </Modal>
  );
};

const LeftButton = styled(Button)`
  margin-right: 16px;
`;

const StyledInput = styled(Input)`
  margin-bottom: 24px;
`;
const ErrorContainer = styled.div`
  margin-top: 8px;
`;
const DUPLICATE_KEY_NAME = "The key name already exists.";
const INVALID_SSH_KEY = "The SSH key must begin with 'ssh-rsa' or 'ssh-dss'.";
const EMPTY_KEY_NAME = "The key name cannot be empty.";
const SSH_RSA = "ssh-rsa";
const SSH_DSS = "ssh-dss";
