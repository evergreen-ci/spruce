import { useQuery } from "@apollo/client";
import styled from "@emotion/styled";
import Button from "@leafygreen-ui/button";
import Card from "@leafygreen-ui/card";
import {
  InlineCode,
  Subtitle,
  Body,
  Disclaimer,
} from "@leafygreen-ui/typography";
import { Skeleton } from "antd";
import { usePreferencesAnalytics } from "analytics";
import { Accordion } from "components/Accordion";
import { StyledLink } from "components/styles";
import { cliDocumentationUrl } from "constants/externalResources";
import { size, fontSize } from "constants/tokens";
import {
  ClientConfigQuery,
  ClientConfigQueryVariables,
  ClientBinary,
} from "gql/generated/types";
import { GET_CLIENT_CONFIG } from "gql/queries";
import { PreferencesCard } from "pages/preferences/Card";

export const DownloadCard = () => {
  const { data, loading } = useQuery<
    ClientConfigQuery,
    ClientConfigQueryVariables
  >(GET_CLIENT_CONFIG);

  if (loading) {
    return <Skeleton active paragraph={{ rows: 6 }} />;
  }
  const { clientConfig } = data;
  const { clientBinaries } = clientConfig || {};
  const topBinaries = clientBinaries.filter(filterBinaries);
  const otherBinaries = clientBinaries.filter(
    (binary) => !filterBinaries(binary)
  );

  return (
    <PreferencesCard>
      <Subtitle>Command-Line Client</Subtitle>
      <CardDescription>
        <Body>
          View the{" "}
          <StyledLink href={cliDocumentationUrl}>documentation</StyledLink> or
          run <InlineCode>evergreen --help</InlineCode> or{" "}
          <InlineCode>evergreen [command] --help</InlineCode> for additional
          assistance.
        </Body>
      </CardDescription>
      <CardGroup>
        {topBinaries.map((binary) => (
          <CliDownloadBox
            key={`downloadBox_${binary.url}`}
            title={
              prettyDisplayNameTop[binary.displayName] || binary.displayName
            }
            link={binary.url}
            description={descriptions[binary.displayName]}
          />
        ))}
      </CardGroup>
      <Accordion title="Show More" toggledTitle="Show Less">
        <ExpandableLinkContents clientBinaries={otherBinaries} />
      </Accordion>
    </PreferencesCard>
  );
};

interface CliDownloadBoxProps {
  title: string;
  link: string | null;
  description?: string;
}
const CliDownloadBox: React.VFC<CliDownloadBoxProps> = ({
  title,
  description,
  link,
}) => {
  const { sendEvent } = usePreferencesAnalytics();
  return (
    <CliDownloadCard>
      <CliDownloadTitle>{title}</CliDownloadTitle>
      {description && <Disclaimer>{description}</Disclaimer>}
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
        size="small"
      >
        Download
      </CliDownloadButton>
    </CliDownloadCard>
  );
};

interface ExpandableLinkContentsProps {
  clientBinaries: ClientBinary[];
}
const ExpandableLinkContents: React.VFC<ExpandableLinkContentsProps> = ({
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
          {binary.displayName}
        </StyledLink>
      ))}
    </LinkContainer>
  );
};

const descriptions = {
  "OSX 64-bit": "Intel CPU",
  "OSX ARM 64-bit": "M1 CPU",
};
const prettyDisplayNameTop = {
  "OSX ARM 64-bit": "macOS ARM",
  "Windows 64-bit": "Windows",
  "Linux 64-bit": "Linux (64-bit)",
};

const filterBinaries = (binary: ClientBinary) =>
  /darwin_arm64\/|linux_amd64\/|windows_amd64\//.test(binary.url);

const CardGroup = styled.div`
  display: flex;
  margin-bottom: ${size.s};
`;

// @ts-expect-error
const CliDownloadCard = styled(Card)`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: ${size.s};
  :not(:last-of-type) {
    margin-right: ${size.xs};
  }
` as typeof Card;

// @ts-expect-error
const CliDownloadButton = styled(Button)`
  align-self: flex-start;
`;

// @ts-expect-error
const CliDownloadTitle = styled(Subtitle)`
  font-weight: bold;
` as typeof Subtitle;

const CardDescription = styled.div`
  font-size: ${fontSize.m};
  margin-bottom: ${size.m};
`;

const LinkContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: ${size.s};
`;
