import React from "react";
import { useQuery } from "@apollo/client";
import styled from "@emotion/styled";
import Button, { Variant } from "@leafygreen-ui/button";
import Code from "@leafygreen-ui/code";
import { Subtitle } from "@leafygreen-ui/typography";
import { usePreferencesAnalytics } from "analytics";
import { Skeleton } from "antd";
import { SiderCard } from "components/styles";
import { size } from "constants/tokens";
import {
  GetUserConfigQuery,
  GetUserConfigQueryVariables,
} from "gql/generated/types";
import { GET_USER_CONFIG } from "gql/queries";
import get from "lodash/get";
import { environmentalVariables, request } from "utils";

const { post } = request;
const { getUiUrl } = environmentalVariables;

export const AuthenticationCard = () => {
  const { data, loading, refetch } = useQuery<
    GetUserConfigQuery,
    GetUserConfigQueryVariables
  >(GET_USER_CONFIG);
  const { sendEvent } = usePreferencesAnalytics();
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
    sendEvent({ name: "Reset Key" });
    await post(`${getUiUrl()}/settings/newkey`, {});
    refetch();
  };
  const downloadFile = (e) => {
    sendEvent({ name: "Download Auth File" });
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
    <>
      {/* @ts-expect-error */}
      <Container>
        <Subtitle>Authentication</Subtitle>
        <CodeContainer>
          <Code language="yaml">{authCode}</Code>
        </CodeContainer>{" "}
        {/* @ts-expect-error */}
        <StyledButton variant={Variant.Primary} onClick={downloadFile}>
          Download File
        </StyledButton>
        <Button onClick={resetKey}>Reset Key</Button>
      </Container>
    </>
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

// @ts-expect-error
const StyledButton = styled(Button)`
  margin-right: ${size.s};
`;
