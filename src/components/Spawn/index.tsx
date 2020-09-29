import React from "react";
import styled from "@emotion/styled";
import Button from "@leafygreen-ui/button";
import { Body, H2 } from "@leafygreen-ui/typography";
import { Table } from "antd";
import Badge from "components/Badge";
import Icon from "components/icons/Icon";
import { SiderCard } from "components/styles";

export const Container = styled.div`
  margin-left: 60px;
  width: 100%;
`;

export const Title = styled(H2)``;

export const TitleContainer = styled.div`
  display: flex;
  align-items: center;
`;

export const BadgeWrapper = styled.div`
  display: flex;
`;

export const StyledBadge = styled(Badge)`
  margin-right: 10px;
  margin-left: 10px;
`;

export const PlusButton = ({
  children,
  ...props
}: React.ComponentProps<typeof Button>) => (
  <Button {...{ ...props, glyph: <Icon glyph="Plus" /> }}>{children}</Button>
);

const TableContainer = styled.div`
  width: 100%;
  padding-right: 1%;
`;

export const SpawnTable = (props: React.ComponentProps<typeof Table>) => (
  <TableContainer>
    <Table
      {...{
        ...props,
        rowKey: (record) => record.displayName || record.id,
        pagination: false,
        expandRowByClick: true,
        expandIcon: ({ expanded }) => (
          <Icon glyph={expanded ? "CaretDown" : "CaretRight"} />
        ),
      }}
    />
  </TableContainer>
);

export const CardContainer = styled(SiderCard)`
  width: 80%;
  padding-bottom: 32px;
`;

const FieldContainer = styled.div`
  display: flex;
  width: 100%;
  margin-top: 10px;
  margin-bottom: 10px;
`;

const FieldName = styled.div`
  min-width: 150px;
`;

export const DoesNotExpire = "Does not expire";

export const WideButton = styled(Button)`
  justify-content: center;
  width: 140px;
`;

export const ModalContent = styled.div`
  display: flex;
  flex-direction: column;
`;
export const Section = styled(ModalContent)`
  margin-top: 20px;
`;
export const SectionContainer = styled.div`
  display: flex;
  align-items: center;
  margin-top: 15px;
`;

export const SectionLabel = styled(Body)`
  padding-right: 15px;
  margin-top: 22px;
  min-width: 175px;
`;

interface CardItem {
  label: string;
  value: JSX.Element;
}

interface CardProps {
  "data-cy": string;
  cardItems: CardItem[];
}

const CardField: React.FC<CardItem> = ({ label, value }) => (
  <FieldContainer>
    <FieldName>{label}</FieldName>
    <div>{value}</div>
  </FieldContainer>
);

export const Card: React.FC<CardProps> = ({ "data-cy": dataCy, cardItems }) => (
  <CardContainer data-cy={dataCy}>
    {cardItems.map(({ label, value }) => (
      <CardField key={label} label={label} value={value} />
    ))}
  </CardContainer>
);
