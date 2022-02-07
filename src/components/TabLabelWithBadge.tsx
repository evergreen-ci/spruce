import React from "react";
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
    {tabLabel}{" "}
    <Badge data-cy={dataCyBadge} variant={badgeVariant}>
      {badgeText}
    </Badge>
  </>
);
