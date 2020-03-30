import React from "react";
import { H3 } from "components/Typography";
import { SiderCard } from "components/styles";
import { Divider } from "components/styles/Divider";

interface Props {
  title: string;
}

export const MetadataCard: React.FC<Props> = ({ title, children }) => (
  <SiderCard>
    <H3>{title}</H3>
    <Divider />
    {children}
  </SiderCard>
);
