import React from "react";
import { useQuery } from "@apollo/react-hooks";
import { Subtitle, Body } from "@leafygreen-ui/typography";
import styled from "@emotion/styled";
import { uiColors } from "@leafygreen-ui/palette";
import Button from "@leafygreen-ui/button";
import { Skeleton } from "antd";
import get from "lodash/get";
import { SiderCard, StyledLink } from "components/styles";
import { Accordian } from "components/Accordian";
import { cliDocumentationUrl } from "constants/externalResources";
import { GET_CLIENT_CONFIG } from "gql/queries";
import {
  ClientConfigQuery,
  ClientConfigQueryVariables,
  ClientBinary,
} from "gql/generated/types";

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
  return (
    <Container>
      <Subtitle>Command-Line Client</Subtitle>
      <CardDescription>
        <Body>
          View the{" "}
          <StyledLink href={cliDocumentationUrl}>documentation</StyledLink> or
          run{" "}
        </Body>
        <InlinePre>evergreen --help or evergreen [command] --help</InlinePre>{" "}
        <Body>for additional assistance.</Body>
      </CardDescription>
      <CardGroup>
        <CliDownloadBox
          title="Linux (64-bit)"
          link={getBinaryUrl("linux", "amd64", clientBinaries)}
        />
        <CliDownloadBox
          title="MacOS"
          link={getBinaryUrl("darwin", "amd64", clientBinaries)}
        />
        <CliDownloadBox
          title="Windows"
          link={getBinaryUrl("windows", "amd64", clientBinaries)}
        />
      </CardGroup>
      <Accordian
        title={<StyledLink>Show More</StyledLink>}
        toggledTitle={<StyledLink>Show Less</StyledLink>}
        contents={<ExpandableLinkContents clientBinaries={clientBinaries} />}
        toggleFromBottom
        showCaret={false}
      />
    </Container>
  );
};

interface CliDownloadBoxProps {
  title: string;
  link: string | null;
}
const CliDownloadBox: React.FC<CliDownloadBoxProps> = ({ title, link }) => (
  <CliDownloadCard>
    <CliDownloadTitle>{title}</CliDownloadTitle>
    <CliDownloadButton href={link} disabled={!link} as="a">
      Download
    </CliDownloadButton>
  </CliDownloadCard>
);

interface ExpandableLinkContentsProps {
  clientBinaries: ClientBinary[];
}
const ExpandableLinkContents: React.FC<ExpandableLinkContentsProps> = ({
  clientBinaries,
}) => (
  <LinkContainer>
    <StyledLink href={getBinaryUrl("linux", "arm64", clientBinaries)}>
      Linux ARM 64-bit
    </StyledLink>
    <StyledLink href={getBinaryUrl("linux", "s390x", clientBinaries)}>
      Linux zSeries
    </StyledLink>
    <StyledLink href={getBinaryUrl("linux", "386", clientBinaries)}>
      Linux 32-bit
    </StyledLink>
    <StyledLink href={getBinaryUrl("linux", "ppce64le", clientBinaries)}>
      Linux PowerPC 64-bit
    </StyledLink>
    <StyledLink href={getBinaryUrl("windows", "386", clientBinaries)}>
      Windows 32-bit
    </StyledLink>
  </LinkContainer>
);

const getBinaryUrl = (
  os: string,
  arch: string,
  clientBinaries: ClientBinary[]
) => {
  const binary = clientBinaries.find(
    (clientBinary) => clientBinary.os === os && clientBinary.arch === arch
  );
  return binary ? binary.url : null;
};

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

const CliDownloadButton = styled(Button)`
  align-self: flex-start;
`;

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
