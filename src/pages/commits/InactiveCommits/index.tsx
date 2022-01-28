import styled from "@emotion/styled";
import { uiColors } from "@leafygreen-ui/palette";
import Tooltip from "@leafygreen-ui/tooltip";
import { Body, Disclaimer } from "@leafygreen-ui/typography";
import { CommitRolledUpVersions } from "types/commits";
import { string } from "utils";
import { commitChartHeight, tooltipZIndex } from "../constants";

const { getDateCopy, shortenGithash, trimStringFromMiddle } = string;
const { gray } = uiColors;

export const InactiveCommitsLine = () => (
  <Container>
    <InactiveCommitLine />
  </Container>
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
      ...rolledUpVersions.slice(0, 2).map((v) => (
        <CommitText key={v.revision} data-cy="commit-text">
          {getCommitCopy(v)}
        </CommitText>
      )),
      <HiddenCommitsWrapper key="hidden_commits" data-cy="hidden-commits">
        <Disclaimer>
          {hiddenCommitCount}
          {` more commit${hiddenCommitCount !== 1 ? "s" : ""}`}
        </Disclaimer>
      </HiddenCommitsWrapper>,
      ...rolledUpVersions.slice(-3).map((v) => (
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
    <StyledTooltip
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
      popoverZIndex={tooltipZIndex}
    >
      <TooltipContainer data-cy="inactive-commits-tooltip">
        <TitleText weight="medium">
          {versionCount} {tooltipType}
          {` Commit${versionCount !== 1 ? "s" : ""}`}
        </TitleText>
        {returnedCommits}
      </TooltipContainer>
    </StyledTooltip>
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

const tooltipWidth = 300;
const padding = 16;

const HiddenCommitsWrapper = styled.div`
  width: 60%;
  border-top: 1px solid ${gray.dark2};
  border-bottom: 1px solid ${gray.dark2};
  text-align: center;
  padding: 4px 0;
  align-self: center;
  margin: 16px 0;
`;

const TooltipContainer = styled.div`
  width: ${tooltipWidth}px;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  flex-direction: column;
  background-color: ${gray.light3};
  color: ${gray.dark3};
`;

const ButtonContainer = styled.div`
  cursor: pointer;
  display: flex;
  justify-content: center;
`;

const InactiveCommitLine = styled.div`
  height: ${commitChartHeight}px;
  border: 1px dashed ${gray.light1};
`;

const ButtonText = styled(Disclaimer)`
  margin-top: 8px;
  text-align: center;
  color: ${gray.dark2};
  font-weight: bold;
`;

const TitleText = styled(Body)`
  margin-bottom: 16px;
`;

const Container = styled.div`
  display: flex;
  justify-content: center;
`;

// @ts-ignore-error
const StyledTooltip = styled(Tooltip)`
  max-height: 350px;
  overflow-y: scroll;
`;

const CommitText = styled(Body)`
  padding: 8px 0;
  word-break: break-all;
`;

const CommitTitleText = styled(Body)`
  font-weight: bold;
`;

const CommitBodyText = styled(Body)`
  width: ${tooltipWidth - padding}px;
  padding-left: ${padding}px;
`;

const MAX_COMMIT_COUNT = 5;
