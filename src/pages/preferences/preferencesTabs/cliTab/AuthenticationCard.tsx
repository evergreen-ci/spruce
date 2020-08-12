import React from "react";
import { useQuery } from "@apollo/client";
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
import { post } from "utils/request";

export const AuthenticationCard = () => {
  const { data, loading, refetch } = useQuery<
    GetUserConfigQuery,
    GetUserConfigQueryVariables
  >(GET_USER_CONFIG);

  if (loading) {
    return <Skeleton active paragraph={{ rows: 6 }} />;
  }
  const config = get(data, "userConfig");
  const authCode = `user: "${config.user}"
api_key: "${config.api_key}"
api_server_host: "${config.api_server_host}"
ui_server_host: "${config.ui_server_host}"
`;
  const resetKey = async (e) => {
    e.preventDefault();
    await post("/settings/newkey", {});
    refetch();
  };
  const downloadFile = (e) => {
    // This creates a text blob with the contents of `authCode`
    // It then creates a `a` element and generates an objectUrl pointing to the
    // text blob which is used to get the browser to download it as if it were a file
    e.preventDefault();
    const element = document.createElement("a");
    const file = new Blob([authCode], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `.evergreen.yml`;
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
    URL.revokeObjectURL(element.href);
    document.body.removeChild(element);
  };
  return (
    <Container>
      <Subtitle>Authentication</Subtitle>
      <CodeContainer>
        <Code language="none">{authCode}</Code>
      </CodeContainer>
      <StyledButton variant={Variant.Primary} onClick={downloadFile}>
        Download File
      </StyledButton>
      <Button onClick={resetKey}>Reset Key</Button>
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
