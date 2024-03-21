import { ApolloError } from "@apollo/client";
import styled from "@emotion/styled";
import { PolymorphicAs } from "@leafygreen-ui/polymorphic";
import { Body, BodyProps } from "@leafygreen-ui/typography";
import { Skeleton } from "antd";
import { ErrorWrapper } from "components/ErrorWrapper";
import { SiderCard, wordBreakCss } from "components/styles";
import { Divider } from "components/styles/divider";

interface Props {
  error: ApolloError;
  loading?: boolean;
  children: React.ReactNode;
}

export const MetadataCard: React.FC<Props> = ({
  children,
  error,
  loading,
  ...rest
}) => (
  <SiderCard {...rest}>
    {loading && !error && (
      <Skeleton active title={false} paragraph={{ rows: 4 }} />
    )}
    {error && !loading && (
      <ErrorWrapper data-cy="metadata-card-error">{error.message}</ErrorWrapper>
    )}
    {!loading && !error && children}
  </SiderCard>
);

export const MetadataTitle: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <div>
    <Title weight="medium">{children}</Title>
    <Divider />
  </div>
);

interface ItemProps {
  as?: PolymorphicAs;
  children: React.ReactNode;
  "data-cy"?: string;
}

export const MetadataItem: React.FC<ItemProps> = ({
  as = "p",
  children,
  "data-cy": dataCy,
}) => (
  <Item data-cy={dataCy} as={as}>
    {children}
  </Item>
);

const Title = styled(Body)<BodyProps>`
  font-size: 15px;
`;

const Item = styled(Body)<BodyProps>`
  ${wordBreakCss}
  font-size: 12px;
  line-height: 14px;

  // TODO: Remove when fixed: https://jira.mongodb.org/browse/EVG-18183
  // Override LG's fixed line height
  a {
    line-height: 14px;
  }

  :not(:last-of-type) {
    margin-bottom: 12px;
  }
`;
