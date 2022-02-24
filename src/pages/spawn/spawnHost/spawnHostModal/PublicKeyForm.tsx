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

export type publicKeyStateType = {
  publicKey: PublicKeyInput;
  savePublicKey: boolean;
};

enum PublicKeyFormType {
  Existing = "existingKey",
  New = "newKey",
}

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
  const [selectState, setSelectState] = useState<PublicKeyFormType>(
    PublicKeyFormType.Existing
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
    if (selectState === PublicKeyFormType.New) {
      updatePublicKeyState({ key: "", name: "" });
    }
  }, [selectState]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Container>
      <Subtitle>Public Key</Subtitle>

      <StyledRadioBoxGroup
        value={selectState}
        onChange={(e) => setSelectState(e.target.value as PublicKeyFormType)}
      >
        <RadioBox value={PublicKeyFormType.Existing}>Use existing key</RadioBox>
        <RadioBox value={PublicKeyFormType.New}>Add new key</RadioBox>
      </StyledRadioBoxGroup>

      {selectState === PublicKeyFormType.Existing && (
        <StyledSelect
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
      {selectState === PublicKeyFormType.New && (
        <FlexColumnContainer>
          <StyledTextArea
            id="keyValueInput"
            label="Public Key"
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
              disabled={!savePublicKey}
              spellCheck={false}
              value={keyName}
              onChange={(e) => {
                updatePublicKeyState({ key: publicKey, name: e.target.value });
              }}
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
