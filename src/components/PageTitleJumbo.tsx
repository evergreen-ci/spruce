import React from "react";
import { Skeleton } from "antd";
import { H2 } from "@leafygreen-ui/typography";
import styled from "@emotion/styled";

interface Props {
  loading: boolean;
  hasData: boolean;
  title: string;
  badge: JSX.Element;
  buttons?: JSX.Element;
}

export const PageTitleJumbo: React.FC<Props> = ({
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
          <H2>
            <span data-cy="page-title">
              {title}
              {"  "}
              <BadgeWrapper>{badge}</BadgeWrapper>
            </span>
          </H2>
        </TitleWrapper>
        {buttons ?? null}
      </PageHeader>
    )}
  </>
);
const BadgeWrapper = styled.span`
  display: inline-flex;
  position: relative;
  top: -4px;
  margin-left: 20px;
`;

const PageHeader = styled.div`
  margin-bottom: 15px;
  margin-top: 15px;
  display: flex;
  justify-content: space-between;
`;

const TitleWrapper = styled.div`
  width: 100%;
`;
