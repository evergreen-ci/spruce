import styled from "@emotion/styled";
import { palette } from "@leafygreen-ui/palette";
import { Body, BodyProps, InlineCode } from "@leafygreen-ui/typography";
import { Link } from "react-router-dom";
import ExpandedText from "components/ExpandedText";
import { StyledRouterLink } from "components/styles";
import { getVersionRoute, getTriggerRoute } from "constants/routes";
import { size, zIndex } from "constants/tokens";
import { UpstreamProjectFragment, GitTag } from "gql/generated/types";
import { useSpruceConfig, useDateFormat } from "hooks";
import { shortenGithash } from "utils/string";
import { jiraLinkify } from "utils/string/jiraLinkify";

const { gray } = palette;
const MAX_CHAR = 40;
interface Props {
  githash: string;
  gitTags: GitTag[];
  createTime: Date;
  author: string;
  message: string;
  versionId: string;
  onClickGithash?: () => void;
  onClickJiraTicket?: () => void;
  onClickUpstreamProject?: () => void;
  upstreamProject?: UpstreamProjectFragment["upstreamProject"];
}

const CommitChartLabel: React.FC<Props> = ({
  author,
  createTime,
  gitTags,
  githash,
  message,
  onClickGithash = () => {},
  onClickJiraTicket = () => {},
  onClickUpstreamProject = () => {},
  upstreamProject,
  versionId,
}) => {
  const getDateCopy = useDateFormat();
  const createDate = new Date(createTime);
  const shortenMessage = message.length > MAX_CHAR;
  const shortenedMessage = message.substring(0, MAX_CHAR - 3).concat("...");
  const spruceConfig = useSpruceConfig();
  const jiraHost = spruceConfig?.jira?.host;
  const {
    owner: upstreamOwner,
    project: upstreamProjectIdentifier,
    repo: upstreamRepo,
    revision: upstreamRevision,
    task: upstreamTask,
    triggerType,
    version: upstreamVersion,
  } = upstreamProject || {};

  return (
    <LabelContainer data-cy="commit-label">
      <LabelText>
        <InlineCode
          as={Link}
          onClick={onClickGithash}
          to={getVersionRoute(versionId)}
          data-cy="githash-link"
        >
          {shortenGithash(githash)}
        </InlineCode>{" "}
        <b title={getDateCopy(createDate)}>
          {getDateCopy(createDate, { omitSeconds: true, omitTimezone: true })}
        </b>{" "}
      </LabelText>
      {upstreamProject && (
        <LabelText>
          Triggered from:{" "}
          <StyledRouterLink
            onClick={onClickUpstreamProject}
            to={getTriggerRoute({
              triggerType,
              upstreamTask,
              upstreamVersion,
              upstreamRevision,
              upstreamOwner,
              upstreamRepo,
            })}
          >
            {upstreamProjectIdentifier}
          </StyledRouterLink>
        </LabelText>
      )}
      <LabelText>{author} -</LabelText>
      <LabelText>
        {jiraLinkify(
          shortenMessage ? shortenedMessage : message,
          jiraHost,
          onClickJiraTicket,
        )}
      </LabelText>
      {shortenMessage && (
        <ExpandedText
          popoverZIndex={zIndex.tooltip}
          message={message}
          data-cy="long-commit-message-tooltip"
        />
      )}
      {gitTags && (
        <LabelText>Git Tags: {gitTags.map((g) => g.tag).join(", ")}</LabelText>
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
  word-break: normal;
  overflow-wrap: anywhere;
`;

const LabelText = styled(Body)<BodyProps>`
  color: ${gray.dark2};
  width: 100%;
  font-size: 12px;
`;

export default CommitChartLabel;
