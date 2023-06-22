import styled from "@emotion/styled";
import Checkbox from "@leafygreen-ui/checkbox";
import { Body, BodyProps } from "@leafygreen-ui/typography";
import { size } from "constants/tokens";
import { VariantTask } from "gql/generated/types";
import { CheckboxState } from "pages/configurePatch/configurePatchCore/types";
import { TaskLayoutGrid } from "../styles";

interface DisabledVariantTasksListProps {
  "data-cy": string;
  status: CheckboxState;
  variantTasks: VariantTask[];
}

const DisabledVariantTasksList: React.VFC<DisabledVariantTasksListProps> = ({
  "data-cy": dataCy,
  status,
  variantTasks,
}) => (
  <>
    {variantTasks.map(({ name, tasks }) => (
      <div key={`variant_${name}`}>
        <StyledBody weight="medium">{name}</StyledBody>
        <TaskLayoutGrid>
          {tasks.map((taskName) => (
            <Checkbox
              data-cy={dataCy}
              key={`${name}-${taskName}`}
              label={taskName}
              checked={status === CheckboxState.CHECKED}
              disabled
            />
          ))}
        </TaskLayoutGrid>
      </div>
    ))}
  </>
);

const StyledBody = styled(Body)<BodyProps>`
  margin: ${size.xs} 0;
`;

export default DisabledVariantTasksList;
