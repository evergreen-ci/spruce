import styled from "@emotion/styled";
import Badge from "@leafygreen-ui/badge";
import { InfoSprinkle } from "@leafygreen-ui/info-sprinkle";
import { Skeleton } from "@leafygreen-ui/skeleton-loader";
import { BaseFontSize } from "@leafygreen-ui/tokens";
import { size } from "constants/tokens";
import { TaskQuery } from "gql/generated/types";
import { useBreakingTask } from "hooks/useBreakingTask";
import { useLastPassingTask } from "hooks/useLastPassingTask";

type Props = {
  taskId: string;
};

/**
 * Returns whether the task is in stepback.
 * @param task The task to check if it is in stepback.
 * @returns Whether the task is in stepback.
 */
export function inStepback(task: TaskQuery["task"]) {
  // The 'lastFailingStepbackTaskId' is set for all stepback tasks except the first one.
  const stepback =
    task?.stepbackInfo?.lastFailingStepbackTaskId !== undefined &&
    task?.stepbackInfo?.lastFailingStepbackTaskId !== "";

  // The 'nextStepbackTaskId' is only set when the next task in stepback is running/finished.
  // This happens in the beginning of stepback or them middle of stepback. This condition is
  // covering for the beginning of stepback.
  const beginningStepback =
    task?.stepbackInfo?.nextStepbackTaskId !== undefined &&
    task?.stepbackInfo?.nextStepbackTaskId !== "";

  // If the task is in stepback or beginning stepback, it is counted as in stepback.
  return stepback || beginningStepback;
}

export const Stepback: React.FC<Props> = ({ taskId }) => {
  const { loading, task: breakingTask } = useBreakingTask(taskId);
  const { task: lastPassingTask } = useLastPassingTask(taskId);

  // The last stepback task has an undefined last passing task (it is passing itself).
  const isLastStepbackTask = lastPassingTask === undefined;

  // The stepback is finished if there is a breaking task or we are on the last stepback task.
  const finished = breakingTask !== undefined || isLastStepbackTask;

  return (
    <StepbackWrapper>
      Stepback:
      <InfoSprinkle baseFontSize={BaseFontSize.Body1}>
        When Stepback is completed you can access the breaking commit via the
        relevant commits dropdown.
      </InfoSprinkle>
      {loading && <Skeleton size="small" />}
      {!loading && !finished && <Badge variant="lightgray">In progress</Badge>}
      {!loading && finished && <Badge variant="green">Complete</Badge>}
    </StepbackWrapper>
  );
};

const StepbackWrapper = styled.div`
  margin-top: ${size.xxs};
  display: flex;
  align-items: center;
  gap: ${size.xxs};
`;
