import { useQuery } from "@apollo/client";
import styled from "@emotion/styled";
import Button, { Variant } from "@leafygreen-ui/button";
import Code from "@leafygreen-ui/code";
import { Subtitle } from "@leafygreen-ui/typography";
import { Skeleton } from "antd";
import get from "lodash/get";
import { usePreferencesAnalytics } from "analytics";
import { SettingsCard } from "components/SettingsCard";
import { size } from "constants/tokens";
import { UserConfigQuery, UserConfigQueryVariables } from "gql/generated/types";
import { USER_CONFIG } from "gql/queries";
import { request } from "utils";

const { post } = request;

export const AuthenticationCard = () => {
  const { data, loading, refetch } = useQuery<
    UserConfigQuery,
    UserConfigQueryVariables
  >(USER_CONFIG);
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
    await post(`/settings/newkey`, {});
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
    <SettingsCard>
      <Subtitle>Authentication</Subtitle>
      <CodeContainer>
        <Code language="yaml">{authCode}</Code>
      </CodeContainer>
      <ButtonGroup>
        <Button variant={Variant.Primary} onClick={downloadFile}>
          Download file
        </Button>
        <Button onClick={resetKey}>Reset key</Button>
      </ButtonGroup>
    </SettingsCard>
  );
};

const CodeContainer = styled.div`
  margin: ${size.m} 0;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: ${size.xs};
`;
