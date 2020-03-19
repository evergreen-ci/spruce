import React from "react";
import { H3 } from "components/Typography";
import { SiderCard } from "components/styles";
import { Divider } from "components/styles/Divider";

export const MetadataCard: React.FC = ({ children }) => (
  <SiderCard>
    <H3>Patch Metadata</H3>
    <Divider />
    {children}
  </SiderCard>
);
