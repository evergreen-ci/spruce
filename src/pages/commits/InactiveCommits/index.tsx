import { useState } from "react";
import styled from "@emotion/styled";
import { palette } from "@leafygreen-ui/palette";
import Tooltip from "@leafygreen-ui/tooltip";
import { Disclaimer } from "@leafygreen-ui/typography";
import { useProjectHealthAnalytics } from "analytics/projectHealth/useProjectHealthAnalytics";
import { DisplayModal } from "components/DisplayModal";
import Icon from "components/Icon";
import { StyledRouterLink } from "components/styles";
import { getVersionRoute, getTriggerRoute } from "constants/routes";
import { size, zIndex, fontSize } from "constants/tokens";
import { useSpruceConfig, useDateFormat } from "hooks";
import { CommitRolledUpVersions } from "types/commits";
import { Unpacked } from "types/utils";
import { string } from "utils";
import { jiraLinkify } from "utils/string/jiraLinkify";
import { commitChartHeight } from "../constants";

const { shortenGithash, trimStringFromMiddle } = string;
const { blue, gray } = palette;

export const InactiveCommitsLine = () => (
  <InactiveCommitContainer>
    <InactiveCommitLine />
  </InactiveCommitContainer>
);

interface InactiveCommitsProps {
  rolledUpVersions: CommitRolledUpVersions;
  hasFilters: boolean;
}
export const InactiveCommitButton: React.FC<InactiveCommitsProps> = ({
  hasFilters = false,
  rolledUpVersions,
}) => {
  const { sendEvent } = useProjectHealthAnalytics({ page: "Commit chart" });
  const [showModal, setShowModal] = useState(false);
  const versionCount = rolledUpVersions.length;
  const shouldSplitCommits = versionCount > MAX_COMMIT_COUNT;

  const tooltipType = hasFilters ? "Unmatching" : "Inactive";
  let returnedCommits = [];

  if (shouldSplitCommits) {
    const hiddenCommitCount = versionCount - MAX_COMMIT_COUNT;
    returnedCommits = [
      ...rolledUpVersions
        .slice(0, 1)
        .map((v) => <CommitCopy v={v} isTooltip key={v.id} />),
      <HiddenCommitsWrapper
        key="hidden_commits"
        data-cy="hidden-commits"
        onClick={() => {
          sendEvent({ name: "Open hidden commits modal" });
          setShowModal(true);
        }}
      >
        <StyledDisclaimer>
          ({hiddenCommitCount}
          {` more commit${hiddenCommitCount !== 1 ? "s" : ""}...`})
        </StyledDisclaimer>
      </HiddenCommitsWrapper>,
      ...rolledUpVersions
        .slice(-2)
        .map((v) => <CommitCopy v={v} isTooltip key={v.id} />),
    ];
  } else {
    returnedCommits = rolledUpVersions.map((v) => (
      <CommitCopy v={v} isTooltip key={v.id} />
    ));
  }

  return (
    <>
      <DisplayModal
        data-cy="inactive-commits-modal"
        open={showModal}
        setOpen={setShowModal}
        title={`${versionCount} ${tooltipType} Commits`}
      >
        {rolledUpVersions?.map((v) => (
          <CommitCopy v={v} isTooltip={false} key={v.id} />
        ))}
      </DisplayModal>
      <StyledTooltip
        usePortal={false}
        align="bottom"
        justify="middle"
        trigger={
          <ButtonContainer
            onClick={() => {
              sendEvent({
                name: "Toggle commit chart label tooltip",
              });
            }}
            role="button"
          >
            <ButtonText data-cy="inactive-commits-button">
              <div>{versionCount}</div>
              {tooltipType}
            </ButtonText>
          </ButtonContainer>
        }
        triggerEvent="click"
        popoverZIndex={zIndex.tooltip}
        data-cy="inactive-commits-tooltip"
      >
        <TooltipTitleText>
          {versionCount} {tooltipType}
          {` Commit${versionCount !== 1 ? "s" : ""}`}
        </TooltipTitleText>
        {returnedCommits}
      </StyledTooltip>
    </>
  );
};

interface CommitCopyProps {
  v: Unpacked<CommitRolledUpVersions>;
  isTooltip: boolean;
}
/**
 * Function that returns formatted information about commits.
 * If isTooltip is true, the commit message is truncated.
 * @param props - CommitCopyProps
 * @param props.v - rolled up version
 * @param props.isTooltip - boolean to indicate if used in tooltip
 * @returns CommitCopy component
 */
const CommitCopy: React.FC<CommitCopyProps> = ({ isTooltip, v }) => {
  const { sendEvent } = useProjectHealthAnalytics({ page: "Commit chart" });
  const getDateCopy = useDateFormat();
  const spruceConfig = useSpruceConfig();
  const jiraHost = spruceConfig?.jira?.host;
  const message = isTooltip
    ? trimStringFromMiddle(v.message, maxCommitMessageLength)
    : v.message;
  return (
    <CommitText key={v.revision} data-cy="commit-text" tooltip={isTooltip}>
      <CommitTitleText>
        <StyledRouterLink
          onClick={() =>
            sendEvent({
              name: "Click commit label",
              commitType: "inactive",
              link: "githash",
            })
          }
          to={getVersionRoute(v.id)}
        >
          {shortenGithash(v.revision)}
        </StyledRouterLink>{" "}
        {getDateCopy(v.createTime, { omitTimezone: true })}
      </CommitTitleText>
      {v.upstreamProject && (
        <>
          Triggered from:{" "}
          <StyledRouterLink
            to={getTriggerRoute({
              upstreamOwner: v.upstreamProject.owner,
              upstreamRepo: v.upstreamProject.repo,
              triggerType: v.upstreamProject.triggerType,
              upstreamRevision: v.upstreamProject.revision,
              upstreamTask: v.upstreamProject.task,
              upstreamVersion: v.upstreamProject.version,
            })}
          >
            {v.upstreamProject.project}
          </StyledRouterLink>
        </>
      )}
      <CommitBodyText>
        {v.ignored && <StyledIcon data-cy="ignored-icon" glyph="Ignored" />}
        {v.author} -{" "}
        {jiraLinkify(message, jiraHost, () => {
          sendEvent({
            name: "Click commit label",
            commitType: "inactive",
            link: "jira",
          });
        })}{" "}
        (#{v.order})
      </CommitBodyText>
    </CommitText>
  );
};

const StyledIcon = styled(Icon)`
  margin-right: ${size.xxs};
  vertical-align: text-bottom;
`;

const InactiveCommitContainer = styled.div`
  display: flex;
  justify-content: center;
`;

const InactiveCommitLine = styled.div`
  height: ${commitChartHeight}px;
  border: 1px dashed ${gray.light1};
`;

// @ts-expect-error
const StyledTooltip = styled(Tooltip)`
  width: 300px;
`;

const ButtonContainer = styled.div`
  cursor: pointer;
  display: flex;
  justify-content: center;
`;

const ButtonText = styled(Disclaimer)`
  margin-top: ${size.xs};
  text-align: center;
  color: ${gray.dark2};
  font-weight: bold;
`;

const HiddenCommitsWrapper = styled.div`
  align-self: center;
  padding: ${size.xs} 0;
  opacity: 0.75;
`;

const TooltipTitleText = styled.div`
  margin-bottom: ${size.xs};
  font-weight: bold;
`;

const StyledDisclaimer = styled(Disclaimer)`
  cursor: pointer;
  text-align: center;
  :hover {
    color: ${blue.light1};
  }
`;

const CommitText = styled.div<{ tooltip: boolean }>`
  padding: ${({ tooltip }) => (tooltip ? `${size.xxs} 0` : `${size.xs} 0`)};
  word-break: break-all;
  font-size: ${({ tooltip }) => (tooltip ? `13px` : `${fontSize.m}`)};
`;

const CommitTitleText = styled.div`
  font-weight: bold;
`;

const CommitBodyText = styled.div`
  padding-left: ${size.s};
`;

const maxCommitMessageLength = 100;

export const MAX_COMMIT_COUNT = 3;
