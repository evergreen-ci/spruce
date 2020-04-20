import React from "react";
import { ApolloError } from "apollo-client";
import { Divider } from "components/styles/Divider";
import { SiderCard } from "components/styles";
import { Skeleton } from "antd";
import styled from "@emotion/styled";
import { Body } from "@leafygreen-ui/typography";

interface Props {
  title: string;
  error: ApolloError;
  loading?: boolean;
}

export const MetadataCard: React.FC<Props> = ({
  title,
  children,
  error,
  loading,
}) => (
  <SiderCard>
    <Body weight="medium">{title}</Body>
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

export const ErrorWrapper = styled.div`
  word-wrap: break-word;
`;
