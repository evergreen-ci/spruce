import React from "react";
import { useQuery } from "@apollo/react-hooks";
import { uiColors } from "@leafygreen-ui/palette";
import { Body } from "@leafygreen-ui/typography";
import styled from "@emotion/styled";
import { format } from "date-fns";
import get from "lodash/get";
import { SiderCard } from "components/styles";
import Code from "@leafygreen-ui/code";
import { GET_CLIENT_CONFIG } from "gql/queries";
import {
  ClientConfigQuery,
  ClientConfigQueryVariables,
} from "gql/generated/types";

const { gray } = uiColors;

export const VerifyCard = () => {
  const { data } = useQuery<ClientConfigQuery, ClientConfigQueryVariables>(
    GET_CLIENT_CONFIG
  );

  const latestRevision = get(data, "clientConfig.latestRevision", "");
  const verificationCode = "Binary is already up to date - not updating.";
  return (
    <Container>
      <Body>At the command line, type &quot;</Body>

      <InlinePre>evergreen get-update</InlinePre>
      <Body>&quot;. It should display :</Body>
      <CodeContainer>
        <Code copyable={false}>{verificationCode}</Code>
      </CodeContainer>
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
  width: 80%;
`;

const InlinePre = styled("pre")`
  display: inline-block;
  background-color: ${gray.light3};
  margin-bottom: 0;
  overflow: visible;
`;
