import React from "react";
import { ApolloError } from "@apollo/client";
import styled from "@emotion/styled";
import Card from "@leafygreen-ui/card";
import { Skeleton } from "antd";
import { ErrorWrapper } from "components/ErrorWrapper";

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
  <>
    {/* @ts-expect-error */}
    <SiderCard metaData={metaData}>
      {loading && <Skeleton active title={false} paragraph={{ rows: 4 }} />}
      {error && (
        <ErrorWrapper data-cy="metadata-card-error">
          {error.message}
        </ErrorWrapper>
      )}
      {children}
    </SiderCard>
  </>
);

// @ts-expect-error
const SiderCard = styled(Card)<StylingProps>`
  padding-top: 12px;
  padding-bottom: 25px;
  margin-bottom: 30px;
  padding-right: ${(props) => (props.metaData ? "0px" : "28px")};
  padding-left: ${(props) => (props.metaData ? "15px" : "28px")};
  margin-left: ${(props) => (props.metaData ? "0px" : "20px")};
  margin-right: ${(props) => (props.metaData ? "0px" : "20px")};
  > p {
    margin-top: ${(props) => props.metaData && "20px"};
  }
`;
