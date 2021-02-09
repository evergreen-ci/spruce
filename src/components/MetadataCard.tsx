import React from "react";
import { ApolloError } from "@apollo/client";
import { Body } from "@leafygreen-ui/typography";
import { Skeleton } from "antd";
import { ErrorWrapper } from "components/ErrorWrapper";
import { SiderCard } from "components/styles";
import { Divider } from "components/styles/Divider";

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
  <>
    {/* @ts-expect-error */}
    <SiderCard>
      <Body weight="medium">{title}</Body>
      <Divider />
      {loading && !error && (
        <Skeleton active title={false} paragraph={{ rows: 4 }} />
      )}
      {error && !loading && (
        <ErrorWrapper data-cy="metadata-card-error">
          {error.message}
        </ErrorWrapper>
      )}
      {!loading && !error && children}
    </SiderCard>
  </>
);
