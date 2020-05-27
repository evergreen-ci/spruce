import React from "react";
import Button, { Variant } from "@leafygreen-ui/button";
import { Subtitle } from "@leafygreen-ui/typography";
import styled from "@emotion/styled";
import Code from "@leafygreen-ui/code";
import { SiderCard } from "components/styles";

export const AuthenticationCard = () => {
  const authCode = `
  user: "[[userConf.user]]"
  api_key: "[[userConf.api_key]]"
  api_server_host: "[[userConf.api_server_host]]"
  ui_server_host: "[[userConf.ui_server_host]]"
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
