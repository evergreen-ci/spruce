import React from "react";
import { ApolloError } from "apollo-client";
import { Skeleton } from "antd";
import { ErrorWrapper } from "components/ErrorWrapper";
import Card from "@leafygreen-ui/card";
import styled from "@emotion/styled/macro";

interface Props {
  title?: string;
  error: ApolloError;
  loading?: boolean;
}

export const HostTableWrapper: React.FC<Props> = ({
  children,
  error,
  loading,
}) => (
  <SiderCard>
    {loading && !error && (
      <Skeleton active title={false} paragraph={{ rows: 4 }} />
    )}
    {error && !loading && (
      <ErrorWrapper data-cy="metadata-card-error">{error.message}</ErrorWrapper>
    )}
    {!loading && !error && children}
  </SiderCard>
);

export const SiderCard = styled(Card)`
  padding-top: 12px;
  padding-bottom: 25px;
  padding-right: 28px;
  padding-left: 28px;
  margin-bottom: 30px;
  margin-left: 20px;
  margin-right: 20px;
`;
