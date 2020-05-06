import React from "react";
import { Button } from "components/Button";
import { EllipsisBtnCopy } from "components/styles/Button";
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

export const CardDropdownButton = ({
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
    <>
      <Button
        size="small"
        dataCy={dataCyBtn}
        disabled={disabled}
        loading={loading}
        onClick={toggleCard}
      >
        <EllipsisBtnCopy>...</EllipsisBtnCopy>
      </Button>
      {isVisibleCard && <Options data-cy={dataCyCard}>{cardItems}</Options>}
    </>
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
  right: 8px;
  z-index: 1;
  margin-top: 2px;
  padding: 8px;
`;
