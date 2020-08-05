import React from "react";
import { ApolloError } from "apollo-client";
import { Skeleton } from "antd";
import { ErrorWrapper } from "components/ErrorWrapper";
import styled from "@emotion/styled/macro";
import Card from "@leafygreen-ui/card";
import { P2 } from "components/Typography";

interface Props {
  title?: string;
  error: ApolloError;
  loading?: boolean;
}

export const HostMetaDataCard: React.FC<Props> = ({
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
  padding-right: 0px;
  padding-left: 15px;
  margin-bottom: 12px;
`;

export const Row = styled(P2)`
  margin-top: 20px;
`;
