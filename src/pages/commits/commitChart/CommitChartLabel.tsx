import React from "react";
import styled from "@emotion/styled";
import { Body, Disclaimer } from "@leafygreen-ui/typography";
import { Version } from "gql/generated/types";

interface Props {
  version: Version
}

export const CommitChartLabel: React.FC<Props> = ({
  version
}) => (
  <LabelContainer>
    <Disclaimer>
      {githash} {createTime}
    </Disclaimer>
    <Disclaimer>{author} - </Disclaimer>
    <Disclaimer>{message}</Disclaimer>
  </LabelContainer>
);

const LabelContainer = styled.div`
  height: 100%;
  width: 172px;
  display: flex;
  flex-direction: column;
  margin-left: 9px;
  justify-content: flex-start;
  align-items: flex-start;
  color: red;
`;


githash={item.version.id.substring(item.version.id.length - 5)}
createTime="11/5/20 12:58 PM"
author="Robert Mitashiro"
message="CLOUDP-75768: Implement search component for visual config editor (#34727)"