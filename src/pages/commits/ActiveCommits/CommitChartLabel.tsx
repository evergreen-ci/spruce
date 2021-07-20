import styled from "@emotion/styled";
import { uiColors } from "@leafygreen-ui/palette";
import { Disclaimer } from "@leafygreen-ui/typography";
import { string } from "utils";

const { gray } = uiColors;
const { shortDate } = string;
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
  return (
    <LabelContainer>
      <Text>
        {githash} {shortDate(createDate)}
      </Text>
      <Text>{author} - </Text>
      <Text>{message}</Text>
    </LabelContainer>
  );
};

const LabelContainer = styled.div`
  height: 100%;
  width: 172px;
  display: flex;
  margin-top: 10px;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
`;

const Text = styled(Disclaimer)`
  color: ${gray.dark2};
  width: 100%;
`;
