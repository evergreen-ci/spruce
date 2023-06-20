import Checkbox from "@leafygreen-ui/checkbox";
import { Body } from "@leafygreen-ui/typography";
import { TaskLayoutGrid } from "./styles";
import { CheckboxState } from "./types";

interface VariantTasksListProps {
  "data-cy": string;
  name: string;
  status: CheckboxState;
  tasks: string[];
}

const VariantTasksList: React.VFC<VariantTasksListProps> = ({
  "data-cy": dataCy,
  name,
  status,
  tasks,
}) => (
  <>
    <Body>{name}</Body>
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
  </>
);

export default VariantTasksList;
