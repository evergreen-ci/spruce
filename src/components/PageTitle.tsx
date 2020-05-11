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
  buttons,
}) => (
  <>
    {!hasData && loading && (
      <PageHeader>
        <Skeleton active paragraph={{ rows: 0 }} />
      </PageHeader>
    )}
    {hasData && !loading && (
      <PageHeader>
        <TitleWrapper>
          <Subtitle>
            <span data-cy="page-title">
              {title}
              {"  "}
              <BadgeWrapper>{badge}</BadgeWrapper>
            </span>
          </Subtitle>
        </TitleWrapper>
        {buttons ?? null}
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

const TitleWrapper = styled.div`
  width: 60%;
`;
