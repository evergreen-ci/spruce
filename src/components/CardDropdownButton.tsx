import React from "react";
import { Button } from "components/Button";
import { EllipsisBtnCopy } from "components/styles/Button";
import Card from "@leafygreen-ui/card";
import styled from "@emotion/styled";

interface Props {
  disabled?: boolean;
  setIsVisibleCard?: (v: boolean) => void;
  loading?: boolean;
  isVisibleCard?: boolean;
  cardItems: JSX.Element[];
}

export const CardDropdownButton = ({
  disabled = false,
  loading = false,
  setIsVisibleCard = function noop(v: boolean) {
    return;
  },
  isVisibleCard = true,
  cardItems,
}: Props) => {
  const toggleCard = () => {
    setIsVisibleCard(!isVisibleCard);
  };
  return (
    <>
      <Button disabled={disabled} loading={loading} onClick={toggleCard}>
        <EllipsisBtnCopy>...</EllipsisBtnCopy>
      </Button>
      {isVisibleCard && <Options>{cardItems}</Options>}
    </>
  );
};

const Options = styled(Card)`
  position: absolute;
  right: 8px;
  z-index: 1;
  margin-top: 2px;
  padding: 8px;
`;
