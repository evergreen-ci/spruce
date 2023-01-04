import { useQuery } from "@apollo/client";
import Code from "@leafygreen-ui/code";
import { InlineCode, Body } from "@leafygreen-ui/typography";
import get from "lodash/get";
import {
  ClientConfigQuery,
  ClientConfigQueryVariables,
} from "gql/generated/types";
import { GET_CLIENT_CONFIG } from "gql/queries";
import { PreferencesCard } from "pages/preferences/Card";

export const VerifyCard = () => {
  const { data } = useQuery<ClientConfigQuery, ClientConfigQueryVariables>(
    GET_CLIENT_CONFIG
  );

  const latestRevision = get(data, "clientConfig.latestRevision", "");
  const verificationCode = `
[message='Binary is already up to date - not updating.' revision='${latestRevision}']`;

  return (
    <PreferencesCard>
      <Body>
        On the command line, type <InlineCode>evergreen get-update</InlineCode>.
        It should display:
      </Body>
      <Code copyable={false} language="shell">
        {verificationCode}
      </Code>
    </PreferencesCard>
  );
};
