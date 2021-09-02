import styled from "@emotion/styled";
import Icon from "@leafygreen-ui/icon";
import { Input } from "antd";
import { usePatchAnalytics } from "analytics";
import { useFilterInputChangeHandler } from "hooks";
import { PatchTasksQueryParams } from "types/task";

export const TaskFilters: React.FC = () => {
  const patchAnalytics = usePatchAnalytics();
  const sendFilterTasksEvent = (filterBy: string) =>
    patchAnalytics.sendEvent({ name: "Filter Tasks", filterBy });
  const filterHookProps = {
    resetPage: true,
    sendAnalyticsEvent: sendFilterTasksEvent,
  };
  const [
    variantFilterValue,
    variantFilterValueOnChange,
  ] = useFilterInputChangeHandler({
    urlParam: PatchTasksQueryParams.Variant,
    ...filterHookProps,
  });
  const [
    taskNameFilterValue,
    taskNameFilterValueOnChange,
  ] = useFilterInputChangeHandler({
    urlParam: PatchTasksQueryParams.TaskName,
    ...filterHookProps,
  });

  return (
    <FiltersWrapper>
      <Input
        style={{ width: "25%" }}
        data-cy="task-name-input"
        placeholder="Search Task Name"
        suffix={<Icon glyph="MagnifyingGlass" />}
        value={taskNameFilterValue}
        onChange={taskNameFilterValueOnChange}
      />
      <Input
        style={{ width: "25%" }}
        data-cy="variant-input"
        placeholder="Search Variant Name"
        suffix={<Icon glyph="MagnifyingGlass" />}
        value={variantFilterValue}
        onChange={variantFilterValueOnChange}
      />
    </FiltersWrapper>
  );
};

const FiltersWrapper = styled.div`
  display: flex;
  margin-bottom: 12px;
  > :not(:last-child) {
    margin-right: 20px;
  }
`;
