import React from "react";
import styled from "@emotion/styled";
import Badge, { Variant } from "components/Badge";

interface Props {
  tabLabel: string;
  badgeText: string | number;
  badgeVariant: Variant;
  dataCyBadge?: string;
}
export const TabLabelWithBadge: React.FC<Props> = ({
  tabLabel,
  badgeText,
  badgeVariant,
  dataCyBadge,
}) => (
  <>
    <ShiftedLabelContainer>{tabLabel}</ShiftedLabelContainer>{" "}
    <Badge data-cy={dataCyBadge} variant={badgeVariant}>
      {badgeText}
    </Badge>
  </>
);

const ShiftedLabelContainer = styled.span`
  position: relative;
  top: 2px;
`;
