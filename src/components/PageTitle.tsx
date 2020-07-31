import React from "react";
import { Skeleton } from "antd";
import { H2, Subtitle } from "@leafygreen-ui/typography";
import styled from "@emotion/styled";
import { css } from "@emotion/core";

type Size = "large" | "medium";

interface Props {
  loading: boolean;
  hasData: boolean;
  title: string;
  badge: JSX.Element;
  buttons?: JSX.Element;
  size?: Size;
}

interface TitleTypographyProps {
  size: Size;
}

const TitleTypography: React.FC<TitleTypographyProps> = ({
  children,
  size,
}) => {
  if (size === "large") {
    return <H2>{children}</H2>;
  }
  if (size === "medium") {
    return <Subtitle>{children}</Subtitle>;
  }
};

export const PageTitle: React.FC<Props> = ({
  loading,
  hasData,
  title,
  badge,
  buttons,
  size = "medium",
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
          <TitleTypography size={size}>
            <span data-cy="page-title">
              {title}
              {"  "}
              <BadgeWrapper size={size}>{badge}</BadgeWrapper>
            </span>
          </TitleTypography>
        </TitleWrapper>
        {buttons ?? null}
      </PageHeader>
    )}
  </>
);
const BadgeWrapper = styled.span<TitleTypographyProps>`
  ${({ size }) =>
    size === "medium" &&
    css`
      display: inline-flex;
      position: relative;
      top: -2px;
    `}
  ${({ size }) =>
    size === "large" &&
    css`
      display: inline-flex;
      position: relative;
      top: -4px;
      margin-left: 20px;
    `}
`;

const PageHeader = styled.div`
  margin-bottom: 11px;
  display: flex;
  justify-content: space-between;
`;

const TitleWrapper = styled.div`
  width: 70%;
`;
