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
  display: inline-flex;
  position: relative;
  top: ${(props) => (props.size === "medium" ? "-2px" : `-${tokenSize.xxs}px`)};
  margin-left: ${(props) => props.size === "large" && "20px"};
`;

const PageHeader = styled.div<TitleTypographyProps>`
  margin-bottom: ${(props) => (props.size === "medium" ? "11px" : "30px")};
  margin-top: ${(props) => props.size === "large" && `${tokenSize.s}px`};
  display: flex;
  justify-content: space-between;
`;

const TitleWrapper = styled.div<TitleTypographyProps>`
  max-width: ${(props) => (props.size === "medium" ? "70%" : "100%")};
`;
