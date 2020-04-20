import React from "react";
import styled from "@emotion/styled";
import { Subtitle, Body } from "@leafygreen-ui/typography";
import { uiColors } from "@leafygreen-ui/palette";
import Button from "@leafygreen-ui/button";
import { CodeChangeModules } from "./codeChangesModule/CodeChangesModule";
import { ModuleCodeChanges } from "types/patch";
interface Props {
  index: number;
  title: string;
  author: string;
  commitTime: Date;
  moduleCodeChanges: [ModuleCodeChanges];
}
const { blue, gray } = uiColors;
const Card = styled("div")`
  display: flex;
  margin-top: 16px;
  width: 100%;
`;
const CardTitle = styled(Subtitle)`
  color: ${blue.base};
  margin-bottom: 16px;
`;
const CommitInfo = styled("div")`
  display: flex;
  flex-direction: column;
  grid-area: 1 / 1 / 2 / 2;

  margin-left: 16px;
  padding-bottom: 24px;
  width: 100%;
`;
const CardMetaData = styled(Body)`
  color: ${gray.dark2};
`;

const CommitQueueCardGrid = styled("div")`
  border-bottom: 1px solid ${gray.light2};

  display: grid;
  grid-template-columns: 4fr repeat(2, 1fr);
  grid-template-rows: 1fr;
  grid-column-gap: 0px;
  grid-row-gap: 0px;
`;

const CommitQueueCardActions = styled("div")`
  grid-area: 1 / 3 / 2 / 4;
`;
export const CommitQueueCard: React.FC<Props> = ({
  index,
  title,
  author,
  commitTime,
  moduleCodeChanges
}) => {
  return (
    <Card>
      <Subtitle>{index}.</Subtitle>
      <CommitQueueCardGrid>
        <CommitInfo>
          <CardTitle>{title}</CardTitle>
          <CardMetaData>
            <b>By {author}</b> on {commitTime}
          </CardMetaData>
          <CodeChangeModules moduleCodeChanges={moduleCodeChanges} />
        </CommitInfo>
        <CommitQueueCardActions>
          <Button>Remove Patch From Queue</Button>
        </CommitQueueCardActions>
      </CommitQueueCardGrid>
    </Card>
  );
};
