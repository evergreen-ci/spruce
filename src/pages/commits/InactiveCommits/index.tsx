import styled from "@emotion/styled";
import Tooltip from "@leafygreen-ui/tooltip";
import { Body } from "@leafygreen-ui/typography";

interface InactiveCommitsProps {
  rolledUpVersions: {
    id: string;
    author: string;
    createTime: string;
    order: number;
    message: string;
  }[];
}
export const InactiveCommits: React.FC<InactiveCommitsProps> = ({
  rolledUpVersions,
}) => {
  const versionCount = rolledUpVersions.length;
  const columnCopy =
    versionCount !== 1
      ? `${versionCount} Inactive Commits`
      : `${versionCount} Inactive Commit`;
  return (
    <Tooltip
      align="top"
      justify="start"
      trigger={
        <ButtonContainer>
          <Text>{columnCopy}</Text>
        </ButtonContainer>
      }
      triggerEvent="hover"
    >
      {rolledUpVersions.map((v) => (
        <TooltipContainer>
          {v.createTime} {v.author} {v.message} (#{v.order})
        </TooltipContainer>
      ))}
    </Tooltip>
  );
};

const TooltipContainer = styled.div`
  width: 300px;
`;
const ButtonContainer = styled.div`
  width: 100px;
`;

const Text = styled(Body)`
  display: flex;
  flex-direction: row;
  :before,
  :after {
    content: "";
    flex: 1 1;
    border-bottom: 2px solid #000;
    margin: auto;
  }
`;
