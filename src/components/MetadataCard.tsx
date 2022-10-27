import { ApolloError } from "@apollo/client";
import styled from "@emotion/styled";
import { Body } from "@leafygreen-ui/typography";
import { Skeleton } from "antd";
import { ErrorWrapper } from "components/ErrorWrapper";
import { SiderCard } from "components/styles";
import { Divider } from "components/styles/Divider";

interface Props {
  error: ApolloError;
  loading?: boolean;
  children: React.ReactNode;
}

export const MetadataCard: React.VFC<Props> = ({
  children,
  error,
  loading,
}) => (
  <>
    {/* @ts-expect-error */}
    <SiderCard>
      {loading && !error && (
        <Skeleton active title={false} paragraph={{ rows: 4 }} />
      )}
      {error && !loading && (
        <ErrorWrapper data-cy="metadata-card-error">
          {error.message}
        </ErrorWrapper>
      )}
      {!loading && !error && children}
    </SiderCard>
  </>
);

export const MetadataTitle: React.FC<{}> = ({ children }) => (
  <>
    <Title weight="medium">{children}</Title>
    <Divider />
  </>
);

export const MetadataItem: React.FC<{}> = ({ children }) => (
  <Item>{children}</Item>
);

const Title = styled(Body)`
  font-size: 15px;
`;

const Item = styled(Body)`
  font-size: 12px;
  line-height: 14px;
  margin-bottom: 12px;
`;
