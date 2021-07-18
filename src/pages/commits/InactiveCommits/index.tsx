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
      usePortal={false}
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
      triggerEvent="click"
    >
      <TooltipContainer data-cy="inactive-commits-tooltip">
        <TitleText>
          {`${versionCount}`} Inactive{" "}
          {`Commit${versionCount !== 1 ? "s" : ""}`}
        </TitleText>
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
  margin-left: 60px;
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
  width: 58px;
  cursor: pointer;
  display: flex;
  justify-content: center;
`;

export const InactiveCommitLine = styled.div`
  margin-left: 29px;
  height: 224px;
  border: 1px dashed ${gray.light1};
`;

const TopText = styled.div`
  white-space: nowrap;
`;
const ButtonText = styled(Disclaimer)`
  margin-top: 10px;
  text-align: center;
  display: table;
  color: ${gray.dark2};
  font-weight: bold;
`;

const TitleText = styled(Disclaimer)`
  margin-bottom: 14px;
  font-weight: bold;
  font-size: 14px;
`;

const MAX_COMMIT_COUNT = 5;
