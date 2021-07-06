import React from "react";
import styled from "@emotion/styled";

interface Props {
  githash: string;
  createTime: string;
  author: string;
  message: string;
}

export const CommitChartLabel: React.FC<Props> = ({
  githash,
  createTime,
  author,
  message,
}) => (
  <LabelContainer>
    {githash} {createTime}
    {author}-{message}
  </LabelContainer>
);

const LabelContainer = styled.div`
  height: 100%;
  width: ${(1 / 7) * 100}%;
  display: flex;
  margin-left: 9px;
  justify-content: flex-start;
  align-items: flex-start;
`;
