import React from "react";
import { useQuery } from "@apollo/react-hooks";
import Button, { Variant } from "@leafygreen-ui/button";
import { Subtitle } from "@leafygreen-ui/typography";
import styled from "@emotion/styled";
import Code from "@leafygreen-ui/code";
import { Skeleton } from "antd";
import get from "lodash/get";
import { SiderCard } from "components/styles";
import { GET_USER_CONFIG } from "gql/queries";
import {
  GetUserConfigQuery,
  GetUserConfigQueryVariables,
} from "gql/generated/types";

export const AuthenticationCard = () => {
  const { data, loading } = useQuery<
    GetUserConfigQuery,
    GetUserConfigQueryVariables
  >(GET_USER_CONFIG);

  if (loading) {
    return <Skeleton active paragraph={{ rows: 6 }} />;
  }
  const config = get(data, "userConfig");
  const authCode = `
user: "${config.user}"
api_key: "${config.api_key}"
api_server_host: "${config.api_server_host}"
ui_server_host: "${config.ui_server_host}"
`;
  return (
    <Container>
      <Subtitle>Authentication</Subtitle>
      <CodeContainer>
        <Code language="none">{authCode}</Code>
      </CodeContainer>
      <StyledButton variant={Variant.Primary}>Download File</StyledButton>
      <Button>Reset Key</Button>
    </Container>
  );
};

const Container = styled(SiderCard)`
  padding-left: 20px;
  padding-top: 20px;
  padding-bottom: 20px;
`;

const CodeContainer = styled.div`
  margin-top: 30px;
  margin-bottom: 30px;
`;

const StyledButton = styled(Button)`
  margin-right: 16px;
`;
