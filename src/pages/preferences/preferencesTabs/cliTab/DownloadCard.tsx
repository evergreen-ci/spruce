import React from "react";
import { useQuery } from "@apollo/client";
import styled from "@emotion/styled";
import Button from "@leafygreen-ui/button";
import { uiColors } from "@leafygreen-ui/palette";
import { Subtitle, Body } from "@leafygreen-ui/typography";
import { Skeleton } from "antd";
import get from "lodash/get";
import { usePreferencesAnalytics } from "analytics";
import { Accordian } from "components/Accordian";
import { SiderCard, StyledLink } from "components/styles";
import { cliDocumentationUrl } from "constants/externalResources";
import {
  ClientConfigQuery,
  ClientConfigQueryVariables,
  ClientBinary,
} from "gql/generated/types";
import { GET_CLIENT_CONFIG } from "gql/queries";

const { gray } = uiColors;

export const DownloadCard = () => {
  const { data, loading } = useQuery<
    ClientConfigQuery,
    ClientConfigQueryVariables
  >(GET_CLIENT_CONFIG);

  if (loading) {
    return <Skeleton active paragraph={{ rows: 6 }} />;
  }
  const clientBinaries = get(data, "clientConfig.clientBinaries", []);
  const topBinaries = clientBinaries.filter(filterBinaries);
  const otherBinaries = clientBinaries.filter(
    (binary) => !filterBinaries(binary)
  );

  return (
    <>
      {/* @ts-expect-error */}
      <Container>
        <Subtitle>Command-Line Client</Subtitle>
        <CardDescription>
          <Body>
            View the{" "}
            <StyledLink href={cliDocumentationUrl}>documentation</StyledLink> or
            run &nbsp;{" "}
          </Body>
          <InlinePre>evergreen --help or evergreen [command] --help</InlinePre>{" "}
          <Body>for additional assistance.</Body>
        </CardDescription>
        <CardGroup>
          {topBinaries.map((binary) => (
            <CliDownloadBox
              key={`downloadBox_${binary.url}`}
              title={
                prettyDisplayNameTop[binary.displayName] || binary.displayName
              }
              link={binary.url}
            />
          ))}
        </CardGroup>
        <Accordian
          title={<StyledLink>Show More</StyledLink>}
          toggledTitle={<StyledLink>Show Less</StyledLink>}
          contents={<ExpandableLinkContents clientBinaries={otherBinaries} />}
          toggleFromBottom
          showCaret={false}
        />
      </Container>
    </>
  );
};

interface CliDownloadBoxProps {
  title: string;
  link: string | null;
}
const CliDownloadBox: React.FC<CliDownloadBoxProps> = ({ title, link }) => {
  const { sendEvent } = usePreferencesAnalytics();
  return (
    <>
      {/* @ts-expect-error */}
      <CliDownloadCard>
        {/* @ts-expect-error */}
        <CliDownloadTitle>{title}</CliDownloadTitle>
        <CliDownloadButton
          onClick={() => {
            sendEvent({
              name: "CLI Download Link",
              downloadName: title,
            });
          }}
          href={link}
          disabled={!link} // @ts-expect-error
          as="a"
        >
          Download
        </CliDownloadButton>
      </CliDownloadCard>
    </>
  );
};

interface ExpandableLinkContentsProps {
  clientBinaries: ClientBinary[];
}
const ExpandableLinkContents: React.FC<ExpandableLinkContentsProps> = ({
  clientBinaries,
}) => {
  const { sendEvent } = usePreferencesAnalytics();
  return (
    <LinkContainer>
      {clientBinaries.map((binary) => (
        <StyledLink
          onClick={() => {
            sendEvent({
              name: "CLI Download Link",
              downloadName: binary.displayName,
            });
          }}
          key={`link_${binary.url}`}
          href={binary.url}
        >
          {prettyDisplayNameAccordian[binary.displayName] || binary.displayName}
        </StyledLink>
      ))}
    </LinkContainer>
  );
};

const prettyDisplayNameTop = {
  "OSX 64-bit": "macOS",
  "Windows 64-bit": "Windows",
  "Linux 64-bit": "Linux (64-bit)",
};

const prettyDisplayNameAccordian = {
  "Linux 64-bit": "Linux (64-bit, Legacy)",
};

const filterBinaries = (binary: ClientBinary) =>
  /darwin_amd64\/|linux_amd64\/|windows_amd64\//.test(binary.url);

const Container = styled(SiderCard)`
  padding-left: 20px;
  padding-top: 20px;
  padding-bottom: 20px;
`;
const CardGroup = styled.div`
  display: flex;
`;
const CliDownloadCard = styled(SiderCard)`
  display: flex;
  flex-direction: column;
  width: 180px;
  padding-top: 20px;
  padding-bottom: 20px;
  padding-left: 20px;
  margin-right: 16px;
`;
// @ts-expect-error
const CliDownloadButton = styled(Button)`
  align-self: flex-start;
`;

// @ts-expect-error
const CliDownloadTitle = styled(Subtitle)`
  font-weight: bold;
  padding-bottom: 45px;
`;
const CardDescription = styled.div`
  font-size: 14px;
  margin-bottom: 40px;
`;

const InlinePre = styled("pre")`
  display: inline-block;
  background-color: ${gray.light3};
  margin-bottom: 0;
  overflow: visible;
`;

const LinkContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 16px;
`;
