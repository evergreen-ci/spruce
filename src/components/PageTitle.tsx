import styled from "@emotion/styled";
import { H2, Subtitle } from "@leafygreen-ui/typography";
import { Skeleton } from "antd";
import { size as tokenSize } from "constants/tokens";
import { usePageTitle } from "hooks";

type Size = "large" | "medium";

interface Props {
  loading: boolean;
  title: string | JSX.Element | React.ReactNodeArray;
  pageTitle?: string;
  badge: JSX.Element;
  buttons?: JSX.Element;
  size?: Size;
  children?: React.ReactNode;
}

interface TitleTypographyProps {
  size: Size;
  children: React.ReactNode | string;
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
  badge,
  buttons,
  children,
  loading,
  pageTitle = "Evergreen",
  size = "medium",
  title,
}) => {
  usePageTitle(pageTitle);

  return (
    <>
      {loading && (
        <PageHeader size={size}>
          <Skeleton active paragraph={{ rows: 0 }} />
        </PageHeader>
      )}
      {!loading && (
        <PageHeader size={size}>
          <TitleWrapper size={size}>
            <TitleTypography size={size}>
              <span data-cy="page-title">{title}</span>
              {children}
              <BadgeWrapper size={size}>{badge}</BadgeWrapper>
            </TitleTypography>
          </TitleWrapper>
          {buttons ?? null}
        </PageHeader>
      )}
    </>
  );
};

const BadgeWrapper = styled.div<TitleTypographyProps>`
  display: inline-flex;
  margin-left: ${({ size }) => (size === "large" ? tokenSize.m : tokenSize.s)};
  vertical-align: ${({ size }) =>
    size === "large" ? "middle" : "text-bottom"};
`;

const PageHeader = styled.div<TitleTypographyProps>`
  margin-bottom: ${(props) =>
    props.size === "medium" ? tokenSize.m : tokenSize.l};
  ${({ size }) => size === "large" && `margin-top: ${tokenSize.s};`}
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`;

const TitleWrapper = styled.span<TitleTypographyProps>`
  max-width: ${(props) => (props.size === "medium" ? "70%" : "100%")};
`;
