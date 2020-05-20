import React from "react";
import { Button } from "components/Button";
import Icon from "@leafygreen-ui/icon";
import Card from "@leafygreen-ui/card";
import styled from "@emotion/styled";
import { uiColors } from "@leafygreen-ui/palette";

interface Props {
  disabled?: boolean;
  setIsVisibleDropdown?: (v: boolean) => void;
  loading?: boolean;
  isVisibleDropdown?: boolean;
  dropdownItems: JSX.Element[];
  dataCyBtn?: string;
  dataCyDropdown?: string;
}

export const ButtonDropdown: React.FC<Props> = ({
  disabled = false,
  loading = false,
  setIsVisibleDropdown = () => undefined,
  isVisibleDropdown = true,
  dropdownItems,
  dataCyBtn = "ellipsis-btn",
  dataCyDropdown = "card-dropdown",
}: Props) => {
  const toggleDropdown = () => {
    setIsVisibleDropdown(!isVisibleDropdown);
  };
  return (
    <Container>
      <Button
        size="small"
        dataCy={dataCyBtn}
        disabled={disabled}
        loading={loading}
        onClick={toggleDropdown}
        glyph={<Icon glyph="Ellipsis" />}
      />
      {isVisibleDropdown && (
        <Dropdown data-cy={dataCyDropdown}>{dropdownItems}</Dropdown>
      )}
    </Container>
  );
};
interface CardItemProps {
  disabled: boolean;
}

export const DropdownItem = styled.div`
  > p:hover {
    text-decoration: underline;
    cursor: pointer;
  }
  pointer-events: ${(props: CardItemProps) => props.disabled && "none"};
  > p {
    color: ${(props: CardItemProps) => props.disabled && uiColors.gray.base};
  }
`;

const Dropdown = styled(Card)`
  position: absolute;
  right: 0px;
  z-index: 1;
  margin-top: 2px;
  padding: 8px;
`;

const Container = styled.div`
  position: relative;
`;
