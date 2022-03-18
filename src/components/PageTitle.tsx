import styled from "@emotion/styled";
import { H2, Subtitle } from "@leafygreen-ui/typography";
import { Skeleton } from "antd";
import { size as tokenSize } from "constants/tokens";

type Size = "large" | "medium";

interface Props {
  loading: boolean;
  hasData: boolean;
  title: string | JSX.Element | React.ReactNodeArray;
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
      <PageHeader size={size}>
        <Skeleton active paragraph={{ rows: 0 }} />
      </PageHeader>
    )}
    {hasData && !loading && (
      <PageHeader size={size}>
        <TitleWrapper size={size}>
          <TitleTypography size={size}>
            <span data-cy="page-title">{title}</span>
            <BadgeWrapper size={size}>{badge}</BadgeWrapper>
          </TitleTypography>
        </TitleWrapper>
        {buttons ?? null}
      </PageHeader>
    )}
  </>
);

const BadgeWrapper = styled.div<TitleTypographyProps>`
  display: inline-flex;
  margin-left: ${({ size }) => (size === "large" ? tokenSize.m : tokenSize.s)};
  vertical-align: middle;
`;

const PageHeader = styled.div<TitleTypographyProps>`
  margin-bottom: ${(props) =>
    props.size === "medium" ? tokenSize.m : tokenSize.l};
  ${({ size }) => size === "large" && `margin-top: ${tokenSize.s};`}
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`;

const TitleWrapper = styled.div<TitleTypographyProps>`
  max-width: ${(props) => (props.size === "medium" ? "70%" : "100%")};
`;
