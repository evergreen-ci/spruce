import React, { useState } from "react";
import styled from "@emotion/styled";
import { Subtitle } from "@leafygreen-ui/typography";
import Checkbox from "@leafygreen-ui/checkbox";
import TextInput from "@leafygreen-ui/text-input";
import { RadioBox } from "@leafygreen-ui/radio-box-group";
import { Select, Input } from "antd";
import { InputLabel } from "components/styles";
import { PublicKey, PublicKeyInput } from "gql/generated/types";

const { Option } = Select;
const { TextArea } = Input;

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
  const [addNewKey, setAddNewKey] = useState(false);
  const { savePublicKey } = data;
  const { key: publicKey, name: keyName } = data.publicKey;

  const selectPublicKey = (name: string) => {
    const selectedKey = publicKeys.find((key) => key.name === name);
    updatePublicKeyState(selectedKey);
  };
  const updatePublicKeyState = (selectedKey: PublicKey) => {
    const state = { ...data };
    state.publicKey = selectedKey;
    onChange(state);
  };
  return (
    <Container>
      <Subtitle>Public Key</Subtitle>
      <SelectContainer>
        <Select
          showSearch
          style={{ width: 200 }}
          placeholder="Select existing key"
          onChange={selectPublicKey}
        >
          {publicKeys?.map((pk) => (
            <Option key={`public_key_option_${pk.name}`} value={pk.name}>
              {pk.name}
            </Option>
          ))}
        </Select>
        <PaddedText>or</PaddedText>
        <RadioBox
          value="addKey"
          onClick={() => setAddNewKey(!addNewKey)}
          onChange={() => undefined}
          checked={addNewKey}
          size="full"
        >
          Add new key
        </RadioBox>
      </SelectContainer>
      {addNewKey && (
        <FlexColumnContainer>
          <InputLabel htmlFor="keyValueInput">Public Key</InputLabel>
          <StyledTextArea
            id="keyValueInput"
            data-cy="key-value-input"
            value={publicKey}
            autoSize={{ minRows: 4, maxRows: 6 }}
            onChange={(e) =>
              updatePublicKeyState({ key: e.target.value, name: keyName })
            }
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
              value={keyName}
              placeholder="Key name"
              onChange={(e) => {
                updatePublicKeyState({ key: publicKey, name: e.target.value });
              }}
              disabled={!savePublicKey}
              data-cy="key-name-input"
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

const FlexContainer = styled.div`
  display: flex;
`;

const KeyNameContainer = styled(FlexContainer)`
  align-items: center;
`;

const Container = styled(FlexColumnContainer)`
  width: 80%;
`;

const PaddedText = styled.span`
  padding-left: 15px;
  padding-right: 15px;
`;
const SelectContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const StyledInput = styled(TextInput)`
  margin-left: 10px;
  flex-grow: 3;
`;

const StyledTextArea = styled(TextArea)`
  margin-bottom: 15px;
`;
