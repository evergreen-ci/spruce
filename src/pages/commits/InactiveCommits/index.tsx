import styled from "@emotion/styled";
import { uiColors } from "@leafygreen-ui/palette";
import Tooltip from "@leafygreen-ui/tooltip";
import { Disclaimer } from "@leafygreen-ui/typography";
import { size, zIndex } from "constants/tokens";
import { CommitRolledUpVersions } from "types/commits";
import { string } from "utils";
import { commitChartHeight } from "../constants";

const { getDateCopy, shortenGithash, trimStringFromMiddle } = string;
const { gray } = uiColors;

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
  const versionCount = rolledUpVersions.length;

  const shouldSplitCommits = versionCount > MAX_COMMIT_COUNT;

  const tooltipType = hasFilters ? "Unmatching" : "Inactive";
  let returnedCommits = [];

  if (shouldSplitCommits) {
    const hiddenCommitCount = versionCount - MAX_COMMIT_COUNT;
    returnedCommits = [
      ...rolledUpVersions.slice(0, 1).map((v) => (
        <CommitText key={v.revision} data-cy="commit-text">
          {getCommitCopy(v)}
        </CommitText>
      )),
      <HiddenCommitsWrapper key="hidden_commits" data-cy="hidden-commits">
        <Disclaimer>
          ({hiddenCommitCount}
          {` more commit${hiddenCommitCount !== 1 ? "s" : ""}...`})
        </Disclaimer>
      </HiddenCommitsWrapper>,
      ...rolledUpVersions.slice(-2).map((v) => (
        <CommitText key={v.revision} data-cy="commit-text">
          {getCommitCopy(v)}
        </CommitText>
      )),
    ];
  } else {
    returnedCommits = rolledUpVersions.map((v) => (
      <CommitText key={v.revision} data-cy="commit-text">
        {getCommitCopy(v)}
      </CommitText>
    ));
  }

  return (
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
  );
};

const getCommitCopy = (v: CommitRolledUpVersions[0]) => (
  <>
    <CommitTitleText>
      {shortenGithash(v.revision)} — {getDateCopy(v.createTime)}
    </CommitTitleText>
    <CommitBodyText>
      {v.author} - {trimStringFromMiddle(v.message, 120)} (#{v.order})
    </CommitBodyText>
  </>
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
  opacity: 0.5;
`;

const TooltipTitleText = styled.div`
  margin-bottom: ${size.xs};
  font-weight: bold;
`;

const CommitText = styled.div`
  padding: ${size.xxs} 0;
  word-break: break-all;
  font-size: 13px;
`;

const CommitTitleText = styled.div`
  font-weight: bold;
`;

const CommitBodyText = styled.div`
  padding-left: ${size.s};
`;

const MAX_COMMIT_COUNT = 3;
