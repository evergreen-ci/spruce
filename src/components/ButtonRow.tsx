import React from "react";
import styled from "@emotion/styled";
import { ButtonDropdown } from "components/ButtonDropdown";

interface Props {
  containerRef: React.MutableRefObject<HTMLDivElement>;
  rowButtons: JSX.Element[];
  cardItems: JSX.Element[];
  cardLoading: boolean;
  cardDisabled: boolean;
  setIsVisibleCard: (v: boolean) => void;
  isVisibleCard: boolean;
}

export const ButtonRow = ({
  containerRef,
  rowButtons,
  cardDisabled,
  cardItems,
  isVisibleCard,
  setIsVisibleCard,
  cardLoading,
}: Props) => {
  return (
    <Container ref={containerRef}>
      {rowButtons}

      <ButtonDropdown
        disabled={cardDisabled}
        cardItems={cardItems}
        isVisibleCard={isVisibleCard}
        setIsVisibleCard={setIsVisibleCard}
        loading={cardLoading}
      />
    </Container>
  );
};

const Container = styled.div`
  > button {
    margin-right: 24px;
  }
  display: flex;
  padding-right: 40px;
`;
