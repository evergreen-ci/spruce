import { useState, useEffect } from "react";
import styled from "@emotion/styled";
import Checkbox from "@leafygreen-ui/checkbox";
import { RadioBox, RadioBoxGroup } from "@leafygreen-ui/radio-box-group";
import { Select, Option } from "@leafygreen-ui/select";
import TextArea from "@leafygreen-ui/text-area";
import TextInput from "@leafygreen-ui/text-input";
import { Subtitle } from "@leafygreen-ui/typography";
import { size, zIndex } from "constants/tokens";
import { PublicKey, PublicKeyInput } from "gql/generated/types";

enum PublicKeyType {
  Existing = "existingKey",
  New = "newKey",
}

export type publicKeyStateType = {
  publicKey: PublicKeyInput;
  savePublicKey: boolean;
};

interface PublicKeyFormProps {
  publicKeys: PublicKey[];
  onChange: React.Dispatch<React.SetStateAction<publicKeyStateType>>;
  data: publicKeyStateType;
}
export const PublicKeyForm: React.FC<PublicKeyFormProps> = ({
  publicKeys,
  onChange,
  data,
}) => {
  const [selectState, setSelectState] = useState<PublicKeyType>(
    PublicKeyType.Existing
  );

  const { savePublicKey } = data;
  const publicKey = data?.publicKey?.key;
  const keyName = data?.publicKey?.name;

  const selectPublicKey = (name: string) => {
    const selectedKey = publicKeys.find((key) => key.name === name);
    updatePublicKeyState(selectedKey);
  };
  const updatePublicKeyState = (selectedKey: PublicKey) => {
    const oldState = { ...data };
    oldState.publicKey = selectedKey;
    onChange(oldState);
  };

  // Clear public key data if user opts to add a new key. (Or else it will be pre-populated
  // with an existing key.)
  useEffect(() => {
    if (selectState === PublicKeyType.New) {
      updatePublicKeyState({ key: "", name: "" });
    }
  }, [selectState]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Container>
      <Subtitle>Public Key</Subtitle>

      <StyledRadioBoxGroup
        onChange={(e) => setSelectState(e.target.value as PublicKeyType)}
        value={selectState}
      >
        <RadioBox
          value={PublicKeyType.Existing}
          data-cy="existing_public_key_button"
        >
          Select existing key
        </RadioBox>
        <RadioBox value={PublicKeyType.New} data-cy="add_public_key_button">
          Add new key
        </RadioBox>
      </StyledRadioBoxGroup>

      {selectState === PublicKeyType.Existing && (
        <StyledSelect
          data-cy="public_key_dropdown"
          placeholder="Select an existing key"
          label="Existing Key"
          onChange={selectPublicKey}
          value={keyName}
          disabled={!data.publicKey}
          usePortal={false}
          allowDeselect={false}
        >
          {publicKeys?.map((pk) => (
            <Option key={`public_key_option_${pk.name}`} value={pk.name}>
              {pk.name}
            </Option>
          ))}
        </StyledSelect>
      )}
      {selectState === PublicKeyType.New && (
        <FlexColumnContainer data-cy="add_new_key_form">
          <StyledTextArea
            id="keyValueInput"
            label="Public Key"
            data-cy="key-value-input"
            value={publicKey}
            onChange={(e) =>
              updatePublicKeyState({ key: e.target.value, name: keyName })
            }
            spellCheck={false}
          />
          <KeyNameContainer>
            <Checkbox
              label="Save public key"
              checked={savePublicKey}
              onChange={(e) =>
                onChange({
                  ...data,
                  savePublicKey: e.target.checked,
                })
              }
            />
            <StyledInput
              id="keyNameInput"
              aria-labelledby="Public Key Name"
              placeholder="Key name"
              value={keyName}
              onChange={(e) => {
                updatePublicKeyState({ key: publicKey, name: e.target.value });
              }}
              disabled={!savePublicKey}
              data-cy="key-name-input"
              spellCheck={false}
            />
          </KeyNameContainer>
        </FlexColumnContainer>
      )}
    </Container>
  );
};

const FlexColumnContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const KeyNameContainer = styled.div`
  display: flex;
  align-items: center;
`;

const Container = styled(FlexColumnContainer)`
  width: 80%;
`;

// @ts-expect-error
const StyledRadioBoxGroup = styled(RadioBoxGroup)`
  height: 40px;
  margin: ${size.s} 0;
`;

// @ts-expect-error
const StyledSelect = styled(Select)`
  position: relative;
  z-index: ${zIndex.tooltip};
`;

const StyledInput = styled(TextInput)`
  margin-left: ${size.xs};
  flex-grow: 3;
`;

const StyledTextArea = styled(TextArea)`
  textarea {
    height: 100px;
  }
  margin-bottom: ${size.s};
`;
