import React from "react";
import { ApolloError } from "apollo-client";
import { Skeleton } from "antd";
import { ErrorWrapper } from "components/ErrorWrapper";
import Card from "@leafygreen-ui/card";
import styled from "@emotion/styled/macro";
import { css } from "@emotion/core";

interface Props {
  error: ApolloError;
  loading?: boolean;
  metaData: boolean;
}
interface StylingProps {
  metaData: boolean;
}

export const HostCard: React.FC<Props> = ({
  children,
  error,
  loading,
  metaData,
}) => (
  <SiderCard metaData={metaData}>
    {loading && !error && (
      <Skeleton active title={false} paragraph={{ rows: 4 }} />
    )}
    {error && !loading && (
      <ErrorWrapper data-cy="metadata-card-error">{error.message}</ErrorWrapper>
    )}
    {children}
  </SiderCard>
);

export const metaDataCard = css`
  > p {
    margin-top: 20px;
  }
`;

export const tableWrapper = css`
  margin-left: 20px;
  margin-right: 20px;
`;

const SiderCard = styled(Card)<StylingProps>`
  padding-top: 12px;
  padding-bottom: 25px;
  margin-bottom: 30px;
  padding-right: ${(props) => (props.metaData ? "0px" : "28px")};
  padding-left: ${(props) => (props.metaData ? "15px" : "28px")};
  margin-left: ${(props) => (props.metaData ? "0px" : "20px")};
  margin-right: ${(props) => (props.metaData ? "0px" : "20px")};
  > * {
    margin-top: ${(props) => props.metaData && "20px"};
  }
`;

// ${(props) => (props.metaData ? { metaDataCard } : { tableWrapper })};
