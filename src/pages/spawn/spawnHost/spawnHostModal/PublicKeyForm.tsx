import React, { useState } from "react";
import styled from "@emotion/styled";
import { Body } from "@leafygreen-ui/typography";
import Checkbox from "@leafygreen-ui/checkbox";
import TextInput from "@leafygreen-ui/text-input";
import { RadioBox } from "@leafygreen-ui/radio-box-group";
import { Select, Input } from "antd";
import { InputLabel } from "components/styles";
import { PublicKey, PublicKeyInput } from "gql/generated/types";

const { Option } = Select;
const { TextArea } = Input;

export interface publicKeyState {
  publicKey: PublicKeyInput;
  savePublicKey: boolean;
}

interface PublicKeyFormProps {
  publicKeys: PublicKey[];
  publicKeyState: [
    publicKeyState,
    React.Dispatch<React.SetStateAction<publicKeyState>>
  ];
}
export const PublicKeyForm: React.FC<PublicKeyFormProps> = ({
  publicKeys,
  publicKeyState,
}) => {
  const [addNewKey, setAddNewKey] = useState(false);
  const { savePublicKey } = publicKeyState[0];
  const { key: publicKey, name: keyName } = publicKeyState[0].publicKey;
  const setPublicKeyState = publicKeyState[1];

  const selectPublicKey = (name: string) => {
    const selectedKey = publicKeys.find((key) => key.name === name);
    updatePublicKeyState(selectedKey);
  };
  const updatePublicKeyState = (selectedKey: PublicKey) => {
    const state = { ...publicKeyState[0] };
    state.publicKey = selectedKey;
    setPublicKeyState(state);
  };
  return (
    <Container>
      <Body>Public Key</Body>
      <SelectContainer>
        <Select
          showSearch
          style={{ width: 200 }}
          placeholder="Select existing key"
          onChange={selectPublicKey}
        >
          {publicKeys?.map((pk) => (
            <Option value={pk.name}>{pk.name}</Option>
          ))}
        </Select>
        or
        <RadioBox
          value="addKey"
          onClick={() => setAddNewKey(!addNewKey)}
          checked={addNewKey}
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
                setPublicKeyState({
                  ...publicKeyState[0],
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
  width: 60%;
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
