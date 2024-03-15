import { useEffect } from "react";
import styled from "@emotion/styled";
import Badge from "@leafygreen-ui/badge";
import Tooltip from "@leafygreen-ui/tooltip";
import { Body } from "@leafygreen-ui/typography";
import Icon from "components/Icon";
import { MetadataItem } from "components/MetadataCard";
import { size } from "constants/tokens";
import { TaskQuery } from "gql/generated/types";
import { useBreakingTask } from "hooks/useBreakingTask";
import { useLastPassingTask } from "hooks/useLastPassingTask";

type Props = {
  taskId: string;
  task: TaskQuery["task"];
};

export const Stepback: React.FC<Props> = ({ task, taskId }) => {
  const { loading, task: breakingTask } = useBreakingTask(taskId);
  const { task: lastPassingTask } = useLastPassingTask(taskId);

  // lastFailingStepbackTaskId is set only in the middle of stepback (not the first task).
  const inStepback =
    task?.stepbackInfo?.lastFailingStepbackTaskId !== undefined &&
    task?.stepbackInfo?.lastFailingStepbackTaskId !== "";
  // nextStepbackTaskId is set when the next task in stepback in known, in the beginning
  // of stepback, it is known right away. In the rest of stepback, it is not.
  const beginningStepback =
    task?.stepbackInfo?.nextStepbackTaskId !== undefined &&
    task?.stepbackInfo?.nextStepbackTaskId !== "";

  // If the task is not in stepback or beginning stepback, it should not show the stepback metadata.
  if (!inStepback && !beginningStepback) {
    return;
  }

  // The last stepback task has an undefined last passing task (it is passing itself).
  const isLastStepbackTask = lastPassingTask === undefined;

  // The stepback is finished if there is a breaking task or we are on the last stepback task.
  const finished = breakingTask !== undefined || isLastStepbackTask;

  return (
    <MetadataItem>
      Stepback:
      <Tooltip
        align="top"
        justify="middle"
        trigger={
          <IconContainer>
            <Icon glyph="InfoWithCircle" size="small" />
          </IconContainer>
        }
        triggerEvent="hover"
      >
        <Body>
          When Stepback is completed you can access the breaking commit via the
          relevant commits dropdown.
        </Body>
      </Tooltip>{" "}
      {loading && <Badge variant="lightgray">Loading</Badge>}
      {!loading && !finished && <Badge variant="lightgray">In progress</Badge>}
      {!loading && finished && <Badge variant="green">Complete</Badge>}
    </MetadataItem>
  );
};

const IconContainer = styled.span`
  margin-left: ${size.xxs};
  vertical-align: bottom;
`;
