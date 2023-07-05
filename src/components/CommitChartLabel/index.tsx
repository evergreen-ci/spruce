import styled from "@emotion/styled";
import { palette } from "@leafygreen-ui/palette";
import { Body, InlineCode } from "@leafygreen-ui/typography";
import { Link } from "react-router-dom";
import ExpandedText from "components/ExpandedText";
import { StyledRouterLink } from "components/styles";
import { getVersionRoute, getTaskRoute } from "constants/routes";
import { size, zIndex } from "constants/tokens";
import { UpstreamProjectFragment, GitTag } from "gql/generated/types";
import { useSpruceConfig, useDateFormat } from "hooks";
import { ProjectTriggerLevel } from "types/triggers";
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

const CommitChartLabel: React.VFC<Props> = ({
  githash,
  gitTags,
  createTime,
  author,
  message,
  versionId,
  onClickGithash = () => {},
  onClickJiraTicket = () => {},
  onClickUpstreamProject = () => {},
  upstreamProject,
}) => {
  const getDateCopy = useDateFormat();
  const createDate = new Date(createTime);
  const shortenMessage = message.length > MAX_CHAR;
  const shortenedMessage = message.substring(0, MAX_CHAR - 3).concat("...");
  const spruceConfig = useSpruceConfig();
  const jiraHost = spruceConfig?.jira?.host;
  const {
    triggerType,
    project: upstreamProjectIdentifier,
    task: upstreamTask,
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
        <b>
          {getDateCopy(createDate, { omitSeconds: true, omitTimezone: true })}
        </b>{" "}
      </LabelText>
      {upstreamProject && (
        <LabelText>
          Triggered from:{" "}
          <StyledRouterLink
            onClick={onClickUpstreamProject}
            to={
              triggerType === ProjectTriggerLevel.TASK
                ? getTaskRoute(upstreamTask.id)
                : getVersionRoute(upstreamVersion.id)
            }
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
          onClickJiraTicket
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

const LabelText = styled(Body)`
  color: ${gray.dark2};
  width: 100%;
  font-size: 12px;
`;

export default CommitChartLabel;
