import styled from "@emotion/styled";
import { uiColors } from "@leafygreen-ui/palette";
import Tooltip from "@leafygreen-ui/tooltip";
import { Disclaimer, Body } from "@leafygreen-ui/typography";
import { string } from "utils";

const { gray, blue } = uiColors;
const { shortDate } = string;
const MAX_CHAR = 42;
interface Props {
  githash: string;
  createTime: Date;
  author: string;
  message: string;
}

export const CommitChartLabel: React.FC<Props> = ({
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
        {githash} {shortDate(createDate)}
      </LabelText>
      <LabelText>{author} -</LabelText>
      <LabelText>{shortenMessage ? shortenedMessage : message}</LabelText>
      {shortenMessage && (
        <Tooltip
          usePortal={false}
          align="bottom"
          justify="middle"
          trigger={
            <ButtonContainer>
              <ButtonText data-cy="tooltip-button">more</ButtonText>
            </ButtonContainer>
          }
          triggerEvent="click"
        >
          <TooltipContainer data-cy="long-commit-message-tooltip">
            {message}
          </TooltipContainer>
        </Tooltip>
      )}
    </LabelContainer>
  );
};

const LabelContainer = styled.div`
  height: 100%;
  width: 172px;
  display: flex;
  margin-top: 10px;
  flex-direction: column;
  align-items: flex-start;
  word-break: break-word;
`;

const LabelText = styled(Body)`
  color: ${gray.dark2};
  width: 100%;
  font-size: 12px;
`;

const ButtonContainer = styled.div`
  cursor: pointer;
`;

const ButtonText = styled(Disclaimer)`
  text-align: center;
  color: ${blue.dark2};
  text-decoration: underline;
`;

const TooltipContainer = styled(Body)`
  width: 200px;
`;
