import { useState } from "react";
import styled from "@emotion/styled";
import { uiColors } from "@leafygreen-ui/palette";
import Tooltip from "@leafygreen-ui/tooltip";
import { Disclaimer } from "@leafygreen-ui/typography";
import { DisplayModal } from "components/DisplayModal";
import { StyledRouterLink } from "components/styles";
import { getVersionRoute } from "constants/routes";
import { size, zIndex, fontSize } from "constants/tokens";
import { CommitRolledUpVersions } from "types/commits";
import { string } from "utils";
import { commitChartHeight } from "../constants";

const { getDateCopy, shortenGithash, trimStringFromMiddle } = string;
const { focus, gray } = uiColors;

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
  rolledUpVersions,
  hasFilters = false,
}) => {
  const [showModal, setShowModal] = useState(false);
  const versionCount = rolledUpVersions.length;

  const shouldSplitCommits = versionCount > MAX_COMMIT_COUNT;

  const tooltipType = hasFilters ? "Unmatching" : "Inactive";
  let returnedCommits = [];

  if (shouldSplitCommits) {
    const hiddenCommitCount = versionCount - MAX_COMMIT_COUNT;
    returnedCommits = [
      ...rolledUpVersions.slice(0, 1).map((v) => getCommitCopy(v, true)),
      <HiddenCommitsWrapper
        key="hidden_commits"
        data-cy="hidden-commits"
        onClick={() => setShowModal(true)}
      >
        <StyledDisclaimer>
          ({hiddenCommitCount}
          {` more commit${hiddenCommitCount !== 1 ? "s" : ""}...`})
        </StyledDisclaimer>
      </HiddenCommitsWrapper>,
      ...rolledUpVersions.slice(-2).map((v) => getCommitCopy(v, true)),
    ];
  } else {
    returnedCommits = rolledUpVersions.map((v) => getCommitCopy(v, true));
  }

  return (
    <>
      <DisplayModal
        data-cy="inactive-commits-modal"
        open={showModal}
        setOpen={setShowModal}
        title={`${versionCount} ${tooltipType} Commits`}
      >
        {rolledUpVersions?.map((version) => getCommitCopy(version, false))}
      </DisplayModal>
      <Tooltip
        usePortal={false}
        align="bottom"
        justify="middle"
        trigger={
          <ButtonContainer role="button">
            <ButtonText data-cy="inactive-commits-button">
              <div>{versionCount}</div>
              {tooltipType}
            </ButtonText>
          </ButtonContainer>
        }
        triggerEvent="click"
        popoverZIndex={zIndex.tooltip}
      >
        <TooltipContainer data-cy="inactive-commits-tooltip">
          <TooltipTitleText>
            {versionCount} {tooltipType}
            {` Commit${versionCount !== 1 ? "s" : ""}`}
          </TooltipTitleText>
          {returnedCommits}
        </TooltipContainer>
      </Tooltip>
    </>
  );
};

/**
 * Function that returns formatted information about commits.
 * If isTooltip is true, the commit message is truncated.
 * @param {CommitRolledUpVersions[0]} v: rolled up version
 * @param {boolean} isTooltip: boolean to indicate if used in tooltip
 */
const getCommitCopy = (v: CommitRolledUpVersions[0], isTooltip: boolean) => (
  <CommitText key={v.revision} data-cy="commit-text" tooltip={isTooltip}>
    <CommitTitleText>
      <StyledRouterLink to={getVersionRoute(v.id)}>
        {shortenGithash(v.revision)}
      </StyledRouterLink>{" "}
      {getDateCopy(v.createTime)}
    </CommitTitleText>
    <CommitBodyText>
      {v.author} -{" "}
      {isTooltip
        ? trimStringFromMiddle(v.message, maxCommitMessageLength)
        : v.message}{" "}
      (#{v.order})
    </CommitBodyText>
  </CommitText>
);

const InactiveCommitContainer = styled.div`
  display: flex;
  justify-content: center;
`;

const InactiveCommitLine = styled.div`
  height: ${commitChartHeight}px;
  border: 1px dashed ${gray.light1};
`;

const TooltipContainer = styled.div`
  width: 300px;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  flex-direction: column;
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
  :hover {
    color: ${focus};
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
