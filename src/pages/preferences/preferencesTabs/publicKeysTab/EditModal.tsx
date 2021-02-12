import React, { useState, useEffect } from "react";
import { useMutation, useQuery } from "@apollo/client";
import styled from "@emotion/styled";
import Button, { Variant } from "@leafygreen-ui/button";
import { Input } from "antd";
import { v4 as uuid } from "uuid";
import { usePreferencesAnalytics } from "analytics";
import { Modal } from "components/Modal";
import { InputLabel, ErrorMessage } from "components/styles";
import { useToastContext } from "context/toast";
import {
  GetMyPublicKeysQuery,
  UpdatePublicKeyMutation,
  UpdatePublicKeyMutationVariables,
  GetMyPublicKeysQueryVariables,
  CreatePublicKeyMutation,
  CreatePublicKeyMutationVariables,
} from "gql/generated/types";
import { CREATE_PUBLIC_KEY } from "gql/mutations";
import { UPDATE_PUBLIC_KEY } from "gql/mutations";
import { GET_MY_PUBLIC_KEYS } from "gql/queries";

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
  const { sendEvent } = usePreferencesAnalytics();
  const dispatchToast = useToastContext();
  const [errors, setErrors] = useState<string[]>([]);
  const [updatePublicKey] = useMutation<
    UpdatePublicKeyMutation,
    UpdatePublicKeyMutationVariables
  >(UPDATE_PUBLIC_KEY, {
    onError(error) {
      dispatchToast.error(
        `There was an error editing the public key: ${error.message}`
      );
    },
    onCompleted() {},
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
      dispatchToast.error(
        `There was an error creating the public key: ${error.message}`
      );
    },
    onCompleted() {},
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
      sendEvent({ name: "Update public key" });
      updatePublicKey({
        variables: { targetKeyName: replaceKeyName, updateInfo: nextKeyInfo },
      });
    } else {
      sendEvent({ name: "Create new public key" });
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
            key="cancel" // @ts-expect-error
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
      <InputLabel htmlFor={KEY_NAME_ID}>Key Name</InputLabel>
      <StyledInput
        value={keyName}
        onChange={(e) => {
          setKeyName(e.target.value);
        }}
        id={KEY_NAME_ID}
        data-cy={KEY_NAME_ID}
      />
      <InputLabel htmlFor={KEY_VALUE_ID}>Public Key</InputLabel>
      <TextArea
        id={KEY_VALUE_ID}
        data-cy={KEY_VALUE_ID}
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

// @ts-expect-error
const LeftButton = styled(Button)`
  margin-right: 16px;
`;
const StyledInput = styled(Input)`
  margin-bottom: 24px;
`;
const ErrorContainer = styled.div`
  margin-top: 8px;
`;
const KEY_NAME_ID = "key-name-input";
const KEY_VALUE_ID = "key-value-input";
const DUPLICATE_KEY_NAME = "The key name already exists.";
const INVALID_SSH_KEY = "The SSH key must begin with 'ssh-rsa' or 'ssh-dss'.";
const EMPTY_KEY_NAME = "The key name cannot be empty.";
const SSH_RSA = "ssh-rsa";
const SSH_DSS = "ssh-dss";
