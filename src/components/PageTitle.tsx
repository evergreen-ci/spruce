import React from "react";
import { Skeleton } from "antd";
import { Subtitle } from "@leafygreen-ui/typography";
import styled from "@emotion/styled";

interface Props {
  loading: boolean;
  hasData: boolean;
  title: string;
  badge: JSX.Element;
}

export const PageTitle: React.FC<Props> = ({
  loading,
  hasData,
  title,
  badge,
}) =>
  loading ? (
    <PageHeader>
      <Skeleton active={true} paragraph={{ rows: 0 }} />
    </PageHeader>
  ) : hasData ? (
    <PageHeader>
      <Subtitle>
        <span data-cy="page-title">
          {title}
          {"  "}
          <BadgeWrapper>{badge}</BadgeWrapper>
        </span>
      </Subtitle>
    </PageHeader>
  ) : null;

const BadgeWrapper = styled.span`
  display: inline-flex;
  position: relative;
  top: -2px;
`;

const PageHeader = styled.div`
  margin-bottom: 11px;
`;
