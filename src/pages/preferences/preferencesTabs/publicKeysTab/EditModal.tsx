import React, { useState, useEffect } from "react";
import { Modal } from "components/Modal";
import { useMutation } from "@apollo/react-hooks";
import styled from "@emotion/styled";
import Button, { Variant } from "@leafygreen-ui/button";

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
  const [keyName, setKeyName] = useState(initialKeyName ?? "");
  const [keyValue, setKeyValue] = useState(initialKeyValue ?? "");

  useEffect(() => {
    setKeyName(initialKeyName);
    setKeyValue(initialKeyValue);
  }, [initialKeyName, initialKeyValue]);
  const modalTitle = replaceKeyName ? "Edit Public Key" : "Add Public Key";

  const isFormValid = true;
  const onClickSave = () => {
    alert("save lol");
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

  return <div />;
};

const LeftButton = styled(Button)`
  margin-right: 16px;
`;
