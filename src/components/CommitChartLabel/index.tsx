import styled from "@emotion/styled";
import { uiColors } from "@leafygreen-ui/palette";
import { Body } from "@leafygreen-ui/typography";
import ExpandedText from "components/ExpandedText";
import { string } from "utils";

const { gray } = uiColors;
const { shortDate } = string;
const MAX_CHAR = 40;
interface Props {
  githash: string;
  createTime: Date;
  author: string;
  message: string;
}

const CommitChartLabel: React.FC<Props> = ({
  githash,
  createTime,
  author,
  message,
}) => {
  const createDate = new Date(createTime);
  const shortenMessage = message.length > MAX_CHAR;
  const shortenedMessage = message.substring(0, MAX_CHAR - 3).concat("...");

  return (
    <LabelContainer data-cy="commit-label">
      <LabelText>
        {githash.substr(0, 6)} {shortDate(createDate)}
      </LabelText>
      <LabelText>{author} -</LabelText>
      <LabelText>{shortenMessage ? shortenedMessage : message}</LabelText>
      {shortenMessage && (
        <ExpandedText message={message} data-cy="long-commit-message-tooltip" />
      )}
    </LabelContainer>
  );
};

const LabelContainer = styled.div`
  height: 100px;
  width: 100%;
  display: flex;
  margin-top: 10px;
  margin-bottom: 16px;
  flex-direction: column;
  align-items: flex-start;
  word-break: break-word;
`;

const LabelText = styled(Body)`
  color: ${gray.dark2};
  width: 100%;
  font-size: 12px;
`;

export default CommitChartLabel;
