import { useQuery } from "@apollo/client";
import styled from "@emotion/styled";
import { uiColors } from "@leafygreen-ui/palette";
import { Body } from "@leafygreen-ui/typography";
import ExpandedText from "components/ExpandedText";
import { StyledRouterLink } from "components/styles";
import { getVersionRoute } from "constants/routes";
import { size, zIndex } from "constants/tokens";
import {
  GetSpruceConfigQuery,
  GetSpruceConfigQueryVariables,
} from "gql/generated/types";
import { GET_SPRUCE_CONFIG } from "gql/queries";
import { string } from "utils";
import { shortenGithash } from "utils/string";
import { jiraLinkify } from "utils/string/jiraLinkify";

const { gray } = uiColors;
const { shortDate } = string;
const MAX_CHAR = 40;
interface Props {
  githash: string;
  createTime: Date;
  author: string;
  message: string;
  versionId: string;
}

const CommitChartLabel: React.VFC<Props> = ({
  githash,
  createTime,
  author,
  message,
  versionId,
}) => {
  const createDate = new Date(createTime);
  const shortenMessage = message.length > MAX_CHAR;
  const shortenedMessage = message.substring(0, MAX_CHAR - 3).concat("...");
  const { data: configData } = useQuery<
    GetSpruceConfigQuery,
    GetSpruceConfigQueryVariables
  >(GET_SPRUCE_CONFIG);
  const jiraHost = configData?.spruceConfig?.jira?.host;

  return (
    <LabelContainer data-cy="commit-label">
      <LabelText>
        <StyledRouterLink to={getVersionRoute(versionId)}>
          {shortenGithash(githash)}
        </StyledRouterLink>{" "}
        <b>{shortDate(createDate)}</b>
      </LabelText>
      <LabelText>{author} -</LabelText>
      <LabelText>
        {jiraLinkify(shortenMessage ? shortenedMessage : message, jiraHost)}
      </LabelText>
      {shortenMessage && (
        <ExpandedText
          popoverZIndex={zIndex.tooltip}
          message={message}
          data-cy="long-commit-message-tooltip"
        />
      )}
    </LabelContainer>
  );
};

const LabelContainer = styled.div`
  min-width: 100%;
  display: flex;
  margin-top: ${size.xs};
  margin-bottom: ${size.s};
  flex-direction: column;
  align-items: flex-start;
  word-break: break-word;
  overflow-y: scroll;
`;

const LabelText = styled(Body)`
  color: ${gray.dark2};
  width: 100%;
  font-size: 12px;
`;

export default CommitChartLabel;
