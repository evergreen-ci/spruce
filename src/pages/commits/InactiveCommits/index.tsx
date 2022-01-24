import styled from "@emotion/styled";
import { uiColors } from "@leafygreen-ui/palette";
import Tooltip from "@leafygreen-ui/tooltip";
import { Body, Disclaimer } from "@leafygreen-ui/typography";
import { CommitRolledUpVersions } from "types/commits";
import { string } from "utils";
import { commitChartHeight, tooltipZIndex } from "../constants";

const { getDateCopy, shortenGithash } = string;
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
      popoverZIndex={tooltipZIndex}
    >
      <TooltipContainer data-cy="inactive-commits-tooltip">
        <TitleText weight="medium">
          {versionCount} {tooltipType}
          {` Commit${versionCount !== 1 ? "s" : ""}`}
        </TitleText>
        {returnedCommits}
      </TooltipContainer>
    </Tooltip>
  );
};

const getCommitCopy = (v: CommitRolledUpVersions[0]) =>
  `${shortenGithash(v.revision)} ${getDateCopy(v.createTime)} ${v.author} ${
    v.message
  } (#${v.order})`;

const CommitText = styled(Body)`
  padding: 4px 0;
`;

const HiddenCommitsWrapper = styled.div`
  width: 60%;
  border-bottom: 1px solid ${gray.dark2};
  text-align: center;
  padding: 4px 0;
  align-self: center;
  margin: 32px 0;
`;

const TooltipContainer = styled.div`
  width: 300px;
  margin: auto;
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

const MAX_COMMIT_COUNT = 5;
