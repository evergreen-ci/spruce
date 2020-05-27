import React from "react";
import { uiColors } from "@leafygreen-ui/palette";
import { Body } from "@leafygreen-ui/typography";
import styled from "@emotion/styled";
import { SiderCard } from "components/styles";
import Code from "@leafygreen-ui/code";

const { gray } = uiColors;

export const VerifyCard = () => {
  const verifcationCode = `
"[evergreen] 2020/05/01 13:30:02 [p=notice]:
[message='Binary is already up to date - not updating.'
revision='2020-04-27']"
  `;
  return (
    <Container>
      <Body>
        At the command line, type &quot;
        <InlinePre>evergreen get-update</InlinePre>&quot;. It should display :
      </Body>
      <CodeContainer>
        <Code copyable={false}>{verifcationCode}</Code>
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
