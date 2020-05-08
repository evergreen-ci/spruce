import React from "react";
import { Skeleton } from "antd";
import { Subtitle } from "@leafygreen-ui/typography";
import styled from "@emotion/styled";

interface Props {
  loading: boolean;
  hasData: boolean;
  title: string;
  badge: JSX.Element;
  buttons?: JSX.Element;
}

export const PageTitle: React.FC<Props> = ({
  loading,
  hasData,
  title,
  badge,
}) => (
  <>
    {!hasData && loading && (
      <PageHeader>
        <Skeleton active paragraph={{ rows: 0 }} />
      </PageHeader>
    )}
    {hasData && !loading && (
      <PageHeader>
        <Subtitle>
          <span data-cy="page-title">
            {title}
            {"  "}
            <BadgeWrapper>{badge}</BadgeWrapper>
          </span>
        </Subtitle>
      </PageHeader>
    )}
  </>
);
const BadgeWrapper = styled.span`
  display: inline-flex;
  position: relative;
  top: -2px;
`;

const PageHeader = styled.div`
  margin-bottom: 11px;
  display: flex;
  justify-content: space-between;
`;
