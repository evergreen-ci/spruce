import React from "react";
import { Subtitle, Body } from "@leafygreen-ui/typography";
import Styled from "@emotion/styled";
import { uiColors } from "@leafygreen-ui/palette";
import Button from "@leafygreen-ui/button";
import { SiderCard, StyledLink } from "components/styles";
import { Accordian } from "components/Accordian";
import {
  cliDocumentationUrl,
  cliDownloadUrls,
} from "constants/externalResources";

const { gray } = uiColors;
export const DownloadCard = () => (
  <Container>
    <Subtitle>Command-Line Client</Subtitle>
    <CardDescription>
      View the <StyledLink href={cliDocumentationUrl}>documentation</StyledLink>{" "}
      or run{" "}
      <InlinePre>evergreen --help or evergreen [command] --help</InlinePre> for
      additional assistance.
    </CardDescription>
    <CardGroup>
      <CliDownloadBox
        title="Linux (64-bit)"
        link={cliDownloadUrls.linux_amd64}
      />
      <CliDownloadBox title="MacOS" link={cliDownloadUrls.darwin_amd64} />
      <CliDownloadBox title="Windows" link={cliDownloadUrls.windows_amd64} />
    </CardGroup>
    <Accordian
      title={<StyledLink>Show More</StyledLink>}
      toggledTitle={<StyledLink>Show Less</StyledLink>}
      contents={<ExpandableLinkContents />}
    />
  </Container>
);

const CliDownloadBox = ({ title, link }) => (
  <CliDownloadCard>
    <CliDownloadTitle>{title}</CliDownloadTitle>
    <CliDownloadButton href={link} as="a">
      Download
    </CliDownloadButton>
  </CliDownloadCard>
);

const ExpandableLinkContents = () => (
  <FlexContainer>
    <StyledLink href={cliDownloadUrls.linux_arm64}>Linux ARM 64-bit</StyledLink>
    <StyledLink href={cliDownloadUrls.linux_s390x}>Linux zSeries</StyledLink>
    <StyledLink href={cliDownloadUrls.linux_386}>Linux 32-bit</StyledLink>
    <StyledLink href={cliDownloadUrls.linux_ppce64le}>
      Linux PowerPC 64-bit
    </StyledLink>
    <StyledLink href={cliDownloadUrls.windows_386}>Windows 32-bit</StyledLink>
  </FlexContainer>
);
const Container = Styled(SiderCard)`
  padding-left: 20px;
  padding-top: 20px;
  padding-bottom: 20px;
`;
const CardGroup = Styled.div`
  display: flex;
`;
const CliDownloadCard = Styled(SiderCard)`
  display: flex;
  flex-direction:column;
  width: 180px;
  padding-top: 20px;
  padding-bottom:20px;
  padding-left: 20px;
  margin-right: 16px;
`;

const CliDownloadButton = Styled(Button)`
  align-self: flex-start;
`;

const CliDownloadTitle = Styled(Subtitle)`
  font-weight: bold;
  padding-bottom: 45px;
`;
const CardDescription = Styled(Body)`
  font-size: 14px;
  padding-bottom: 40px;
`;

const InlinePre = Styled("pre")`
  display: inline-block;
  background-color: ${gray.light3};
  margin-bottom: 0;
  overflow: visible;
`;

const FlexContainer = Styled.div`
  display:flex;
  flex-direction:column;
`;
