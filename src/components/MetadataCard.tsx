import React from "react";
import { ApolloError } from "apollo-client";
import { Divider } from "components/styles/Divider";
import { H3 } from "components/Typography";
import { SiderCard } from "components/styles";
import { Skeleton } from "antd";
import { ErrorWrapper } from "components/ErrorWrapper";

interface Props {
  title: string;
  error: ApolloError;
  loading: boolean;
}

export const MetadataCard: React.FC<Props> = ({
  title,
  children,
  error,
  loading,
}) => (
  <SiderCard>
    <H3>{title}</H3>
    <Divider />
    {loading ? (
      <Skeleton active={true} title={false} paragraph={{ rows: 4 }} />
    ) : error ? (
      <ErrorWrapper data-cy="metadata-card-error">{error.message}</ErrorWrapper>
    ) : (
      children
    )}
  </SiderCard>
);
