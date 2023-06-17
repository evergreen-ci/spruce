import Checkbox from "@leafygreen-ui/checkbox";
import { H4, Tasks } from "./styles";
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
    <H4>{name}</H4>
    <Tasks>
      {tasks.map((taskName) => (
        <Checkbox
          data-cy={dataCy}
          key={`${name}-${taskName}`}
          label={taskName}
          checked={status === CheckboxState.CHECKED}
          disabled
        />
      ))}
    </Tasks>
  </>
);

export default VariantTasksList;
