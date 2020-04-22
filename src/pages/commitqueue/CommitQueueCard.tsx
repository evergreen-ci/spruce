import React from "react";
import styled from "@emotion/styled";
import { Subtitle, Body } from "@leafygreen-ui/typography";
import { uiColors } from "@leafygreen-ui/palette";
import Button from "@leafygreen-ui/button";
import { CodeChangeModule } from "pages/commitqueue/codeChangesModule/CodeChangesModule";
import { StyledRouterLink } from "components/styles/StyledLink";
import { ModuleCodeChanges } from "types/patch";
import { paths } from "constants/routes";
import { format } from "date-fns";
const FORMAT_STR = "MM/dd/yy' at 'hh:mm:ss' 'aa";

interface Props {
  index: number;
  title: string;
  author: string;
  commitTime: Date;
  patchId: string;
  moduleCodeChanges: [ModuleCodeChanges];
}
const { blue, gray } = uiColors;

export const CommitQueueCard: React.FC<Props> = ({
  index,
  title,
  author,
  commitTime,
  patchId,
  moduleCodeChanges,
}) => {
  return (
    <Card>
      <Subtitle>{index}.</Subtitle>
      <CommitQueueCardGrid>
        <CommitInfo>
          <CardTitle to={`${paths.patch}/${patchId}`}>{title}</CardTitle>
          <CardMetaData>
            <b>By {author}</b> on {format(new Date(commitTime), FORMAT_STR)}
          </CardMetaData>
          <div>
            {moduleCodeChanges.map((moduleCodeChange) => (
              <CodeChangeModule
                key={moduleCodeChange.rawLink}
                moduleCodeChange={moduleCodeChange}
              />
            ))}
          </div>
        </CommitInfo>
        <CommitQueueCardActions>
          <Button>Remove Patch From Queue</Button>
        </CommitQueueCardActions>
      </CommitQueueCardGrid>
    </Card>
  );
};

const Card = styled.div`
  display: flex;
  margin-top: 16px;
  width: 100%;
`;
const CardTitle = styled(StyledRouterLink)`
  color: ${blue.base};
  margin-bottom: 16px;
  font-size: 18px;
  font-weight: bold;
`;
const CommitInfo = styled.div`
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

const CommitQueueCardGrid = styled.div`
  border-bottom: 1px solid ${gray.light2};
  display: grid;
  grid-template-columns: 4fr repeat(2, 1fr);
  grid-template-rows: 1fr;
  grid-column-gap: 0px;
  grid-row-gap: 0px;
  width: 100%;
`;

const CommitQueueCardActions = styled.div`
  grid-area: 1 / 3 / 2 / 4;
`;
