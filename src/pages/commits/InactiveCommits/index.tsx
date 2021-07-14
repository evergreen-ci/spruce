import styled from "@emotion/styled";
import { uiColors } from "@leafygreen-ui/palette";
import Tooltip from "@leafygreen-ui/tooltip";
import { Body, Disclaimer } from "@leafygreen-ui/typography";
import { string } from "utils";

const { getDateCopy } = string;
const { gray } = uiColors;

type rolledUpVersion = {
  id: string;
  author: string;
  createTime: Date;
  order: number;
  message: string;
  revision?: string;
};
interface InactiveCommitsProps {
  rolledUpVersions: rolledUpVersion[];
}
export const InactiveCommits: React.FC<InactiveCommitsProps> = ({
  rolledUpVersions,
}) => {
  const versionCount = rolledUpVersions.length;

  const shouldSplitCommits = versionCount > MAX_COMMIT_COUNT;

  let returnedCommits = [];
  if (shouldSplitCommits) {
    const hiddenCommitCount = versionCount - MAX_COMMIT_COUNT;
    returnedCommits = [
      ...rolledUpVersions.slice(0, 2).map((v) => (
        <CommitText key={v.revision} data-cy="commit-text">
          {getCommitCopy(v)}
        </CommitText>
      )),
      <HiddenCommitsWrapper
        key="hidden_commits"
        data-cy="hidden-commits"
      >{`${hiddenCommitCount} more commit${
        hiddenCommitCount !== 1 ? "s" : ""
      }`}</HiddenCommitsWrapper>,
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
      align="bottom"
      justify="middle"
      trigger={
        <ButtonContainer>
          <ButtonText data-cy="inactive-commits-button">
            <TopText>{`${versionCount}`} </TopText>
            inactive
          </ButtonText>
        </ButtonContainer>
      }
      triggerEvent="hover"
    >
      <TooltipContainer data-cy="inactive-commits-tooltip">
        {returnedCommits}
      </TooltipContainer>
    </Tooltip>
  );
};

const getCommitCopy = (v: rolledUpVersion) =>
  `${v.revision.slice(0, 5)} ${getDateCopy(v.createTime)} ${v.author} ${
    v.message
  } (#${v.order})`;

const CommitText = styled(Body)`
  padding: 2px 0;
`;
const HiddenCommitsWrapper = styled.div`
  width: 180px;
  border-bottom: 1px solid ${gray.dark2};
  text-align: center;
  padding: 8px 0;
  margin-bottom: 8px;
`;

const TooltipContainer = styled.div`
  width: 300px;
  margin: auto;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

const ButtonContainer = styled.div`
  width: 58px;
  cursor: pointer;
`;
const TopText = styled.div`
  white-space: nowrap;
`;
const ButtonText = styled(Disclaimer)`
  text-align: center;
  display: table;
  color: ${uiColors.gray.dark2};
  font-weight: bold;
`;

const MAX_COMMIT_COUNT = 5;
