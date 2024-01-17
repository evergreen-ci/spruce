import { useState, useEffect } from "react";
import { useMutation, useQuery } from "@apollo/client";
import styled from "@emotion/styled";
import TextArea from "@leafygreen-ui/text-area";
import TextInput from "@leafygreen-ui/text-input";
import { usePreferencesAnalytics } from "analytics";
import { ConfirmationModal } from "components/ConfirmationModal";
import { ErrorMessage } from "components/styles";
import { size } from "constants/tokens";
import { useToastContext } from "context/toast";
import {
  MyPublicKeysQuery,
  UpdatePublicKeyMutation,
  UpdatePublicKeyMutationVariables,
  MyPublicKeysQueryVariables,
  CreatePublicKeyMutation,
  CreatePublicKeyMutationVariables,
} from "gql/generated/types";
import { CREATE_PUBLIC_KEY, UPDATE_PUBLIC_KEY } from "gql/mutations";
import { MY_PUBLIC_KEYS } from "gql/queries";
import { validators, string } from "utils";

const { validateSSHPublicKey } = validators;
const { stripNewLines } = string;

export interface EditModalPropsState {
  initialPublicKey?: { name: string; key: string }; // initialPublicKey is the key that will be updated in the db when provided
  visible: boolean;
}

interface EditModalProps extends EditModalPropsState {
  onCancel: () => void;
}

export const EditModal: React.FC<EditModalProps> = ({
  initialPublicKey,
  onCancel,
  visible,
}) => {
  const { data: myKeysData } = useQuery<
    MyPublicKeysQuery,
    MyPublicKeysQueryVariables
  >(MY_PUBLIC_KEYS, { fetchPolicy: "cache-only" });
  const { sendEvent } = usePreferencesAnalytics();
  const dispatchToast = useToastContext();
  const [errors, setErrors] = useState<string[]>([]);
  const [updatePublicKey] = useMutation<
    UpdatePublicKeyMutation,
    UpdatePublicKeyMutationVariables
  >(UPDATE_PUBLIC_KEY, {
    onError(error) {
      dispatchToast.error(
        `There was an error editing the public key: ${error.message}`,
      );
    },
    refetchQueries: ["MyPublicKeys"],
  });

  const [createPublicKey] = useMutation<
    CreatePublicKeyMutation,
    CreatePublicKeyMutationVariables
  >(CREATE_PUBLIC_KEY, {
    onError(error) {
      dispatchToast.error(
        `There was an error creating the public key: ${error.message}`,
      );
    },
    refetchQueries: ["MyPublicKeys"],
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
    if (!validateSSHPublicKey(keyValue)) {
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
    const nextKeyInfo = { name: keyName, key: stripNewLines(keyValue) };
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
    <ConfirmationModal
      data-cy="key-edit-modal"
      open={visible}
      onCancel={closeModal}
      onConfirm={onClickSave}
      submitDisabled={errors.length > 0}
      buttonText="Save"
      title={replaceKeyName ? "Update Public Key" : "Add Public Key"}
    >
      <StyledInput
        label="Key Name"
        id={KEY_NAME_ID}
        data-cy={KEY_NAME_ID}
        value={keyName}
        onChange={(e) => {
          setKeyName(e.target.value);
        }}
        spellCheck={false}
      />
      <TextArea
        label="Public Key"
        id={KEY_VALUE_ID}
        data-cy={KEY_VALUE_ID}
        value={keyValue}
        onChange={(e) => setKeyValue(e.target.value)}
        rows={8}
        spellCheck={false}
      />
      <ErrorContainer>
        {visible &&
          errors.map((text) => (
            <div key={`error_message_${text}`} data-cy="error-message">
              <ErrorMessage>{text}</ErrorMessage>
            </div>
          ))}
      </ErrorContainer>
    </ConfirmationModal>
  );
};

const StyledInput = styled(TextInput)`
  margin-bottom: ${size.m};
`;
const ErrorContainer = styled.div`
  margin-top: ${size.xs};
`;
const KEY_NAME_ID = "key-name-input";
const KEY_VALUE_ID = "key-value-input";
const DUPLICATE_KEY_NAME = "The key name already exists.";
const INVALID_SSH_KEY =
  "The SSH key must begin with 'ssh-rsa' or 'ssh-dss' or 'ssh-ed25519' or 'ecdsa-sha2-nistp256'.";
const EMPTY_KEY_NAME = "The key name cannot be empty.";
