import React from "react";
import styled from "@emotion/styled";
import { uiColors } from "@leafygreen-ui/palette";
import { Disclaimer } from "@leafygreen-ui/typography";
import { format } from "date-fns";
import { Maybe } from "gql/generated/types";

const { gray } = uiColors;
interface Props {
  githash: string;
  createTime: Maybe<Date>;
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
      <div>
        {githash} {format(createDate, "M/d/yy")} {format(createDate, "h:mm a")}{" "}
      </div>
      <div>{author} - </div>
      <div>{message}</div>
    </LabelContainer>
  );
};

const LabelContainer = styled(Disclaimer)`
  height: 100%;
  width: 172px;
  display: flex;
  margin-top: 10px;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  color: ${gray.dark2};
`;
