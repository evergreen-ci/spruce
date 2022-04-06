import React, { useEffect, useState } from "react";
import styled from "@emotion/styled";
import Checkbox from "@leafygreen-ui/checkbox";
import { Popconfirm as AntPopconfirm } from "antd";
import { size } from "constants/tokens";

interface Props extends React.ComponentProps<typeof AntPopconfirm> {
  children: React.ReactNode;
}

export const Popconfirm: React.FC<Props> = ({ children, ...props }) => (
  // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
  <span
    onClick={(e) => {
      e.stopPropagation(); // Stop click propagation for clicks on Popconfirm popup body.
    }}
  >
    <AntPopconfirm {...props}>{children}</AntPopconfirm>
  </span>
);

interface PopconfirmWithCheckboxProps {
  onConfirm: (e: React.MouseEvent) => void;
  title: string;
  checkboxLabel?: string;
  children: React.ReactNode;
}

export const PopconfirmWithCheckbox: React.FC<PopconfirmWithCheckboxProps> = ({
  checkboxLabel, // truthiness determines if checkbox is rendered
  children,
  onConfirm,
  title,
}) => {
  const [checked, setChecked] = useState(!checkboxLabel);
  useEffect(() => {
    setChecked(!checkboxLabel);
  }, [checkboxLabel]);
  return (
    <Popconfirm
      icon={null}
      placement="topRight"
      title={
        <>
          {title}
          {checkboxLabel && (
            <CheckboxContainer>
              <Checkbox
                data-cy="popconfirm-checkbox"
                className="cy-checkbox"
                onChange={() => setChecked(!checked)}
                label={checkboxLabel}
                checked={checked}
                bold={false}
              />
            </CheckboxContainer>
          )}
        </>
      }
      onConfirm={onConfirm}
      okText="Yes"
      cancelText="Cancel"
      okButtonProps={{ disabled: !checked }}
    >
      {children}
    </Popconfirm>
  );
};

const CheckboxContainer = styled.div`
  padding-top: ${size.xs};
`;
