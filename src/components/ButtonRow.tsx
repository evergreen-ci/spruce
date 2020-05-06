import React from "react";
import styled from "@emotion/styled";
import { CardDropdownButton } from "components/CardDropdownButton";

interface Props {
  containerRef: React.MutableRefObject<HTMLDivElement>;
  rowButtons: JSX.Element[];
  cardButtons: JSX.Element[];
  cardLoading: boolean;
  cardDisabled: boolean;
  setIsVisibleCard: (v: boolean) => void;
  isVisibleCard: boolean;
}

export const ActionButtons = (props: Props) => {
  return (
    <Container ref={props.containerRef}>
      {props.rowButtons}
      <div>
        <CardDropdownButton
          disabled={props.cardDisabled}
          cardItems={props.cardButtons}
          isVisibleCard={props.isVisibleCard}
          setIsVisibleCard={props.setIsVisibleCard}
          loading={props.cardLoading}
        />
      </div>
    </Container>
  );
};

const Container = styled.div`
  > button {
    margin-right: 8px;
  }
  display: flex;
`;
