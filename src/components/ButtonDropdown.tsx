import React from "react";
import { Button } from "components/Button";
import Icon from "@leafygreen-ui/icon";
import Card from "@leafygreen-ui/card";
import styled from "@emotion/styled";
import { uiColors } from "@leafygreen-ui/palette";

interface Props {
  disabled?: boolean;
  setIsVisibleCard?: (v: boolean) => void;
  loading?: boolean;
  isVisibleCard?: boolean;
  cardItems: JSX.Element[];
  dataCyBtn?: string;
  dataCyCard?: string;
}

export const ButtonDropdown = ({
  disabled = false,
  loading = false,
  setIsVisibleCard = function noop(v: boolean) {
    return;
  },
  isVisibleCard = true,
  cardItems,
  dataCyBtn = "ellipsis-btn",
  dataCyCard = "card-dropdown",
}: Props) => {
  const toggleCard = () => {
    setIsVisibleCard(!isVisibleCard);
  };
  return (
    <Container>
      <Button
        size="small"
        dataCy={dataCyBtn}
        disabled={disabled}
        loading={loading}
        onClick={toggleCard}
        glyph={<Icon glyph="Ellipsis" />}
      ></Button>
      {isVisibleCard && <Options data-cy={dataCyCard}>{cardItems}</Options>}
    </Container>
  );
};
interface CardItemProps {
  disabled: boolean;
}

export const CardItem = styled.div`
  > p:hover {
    text-decoration: underline;
    cursor: pointer;
  }
  pointer-events:${(props: CardItemProps) => props.disabled && "none"}; 
  > p {
    color: ${(props: CardItemProps) => props.disabled && uiColors.gray.base};
`;

const Options = styled(Card)`
  position: absolute;
  right: 0px;
  z-index: 1;
  margin-top: 2px;
  padding: 8px;
`;

const Container = styled.div`
  position: relative;
`;
