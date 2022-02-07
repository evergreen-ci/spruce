import React from "react";
import styled from "@emotion/styled";
import { SiderCard } from "components/styles";
import { MyHost, MyVolume } from "types/spawn";

const FieldContainer = styled.div`
  display: flex;
  width: 100%;
  margin-top: 10px;
  margin-bottom: 10px;
`;

const FieldName = styled.div`
  min-width: 150px;
`;

interface CardItem {
  label: string;
  value: JSX.Element;
}

const CardField: React.FC<CardItem> = ({ label, value }) =>
  value !== undefined && (
    <FieldContainer>
      <FieldName>{label}</FieldName>
      <div>{value}</div>
    </FieldContainer>
  );

type FieldMap<T> = {
  [key: string]: (T: T) => JSX.Element;
};

interface DetailsCardProps {
  type: MyHost | MyVolume;
  ["data-cy"]?: string;
  fieldMaps: FieldMap<MyHost | MyVolume>;
}

const CardContainer = styled(SiderCard)`
  width: 80%;
  padding: 16px 32px;
` as typeof SiderCard;

export const DetailsCard: React.FC<DetailsCardProps> = ({
  type,
  "data-cy": dataCy,
  fieldMaps,
}) => (
  <>
    {/* @ts-expect-error */}
    <CardContainer data-cy={dataCy}>
      {Object.keys(fieldMaps).map((key) => (
        <CardField
          key={`${key}_${type.id}`}
          label={key}
          value={fieldMaps[key](type)}
        />
      ))}
    </CardContainer>
  </>
);
