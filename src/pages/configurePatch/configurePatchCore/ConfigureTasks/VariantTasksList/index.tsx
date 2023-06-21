import Checkbox from "@leafygreen-ui/checkbox";
import { Body } from "@leafygreen-ui/typography";
import { VariantTask } from "gql/generated/types";
import { TaskLayoutGrid } from "../styles";
import { CheckboxState } from "../types";

interface VariantTasksListProps {
  "data-cy": string;
  status: CheckboxState;
  variantTasks: VariantTask[];
}

const VariantTasksList: React.VFC<VariantTasksListProps> = ({
  "data-cy": dataCy,
  status,
  variantTasks,
}) => (
  <>
    {variantTasks.map(({ name, tasks }) => (
      <div key={`variant_${name}`}>
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
      </div>
    ))}
  </>
);

export default VariantTasksList;
