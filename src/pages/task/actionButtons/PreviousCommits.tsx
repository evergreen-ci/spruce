import { useState } from "react";
import styled from "@emotion/styled";
import Button from "@leafygreen-ui/button";
import { Option, Select } from "@leafygreen-ui/select";

type commitType = "base" | "lastPassing" | "lastExecuted";
interface Props {
  taskId: string;
}
export const PreviousCommits: React.FC<Props> = () => {
  const [selectState, setSelectState] = useState<commitType>("base");

  return (
    <Container>
      <StyledSelect
        size="small"
        label="Previous commits for this task"
        onChange={(v) => setSelectState(v as commitType)}
        data-cy="previous-commits"
        allowDeselect={false}
        value={selectState}
      >
        <Option value="base" key="base">
          Go to base commit
        </Option>
        <Option value="lastPassing" key="lastPassing">
          Go to last passing version
        </Option>
        <Option value="lastExecuted" key="lastExecuted">
          Go to last executed version
        </Option>
      </StyledSelect>
      <Button size="small">Go</Button>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
`;

// @ts-expect-error
const StyledSelect = styled(Select)`
  margin-right: 8px;
  margin-top: -20px;
`;
