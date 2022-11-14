import Checkbox from "@leafygreen-ui/checkbox";
import Cookies from "js-cookie";
import { useLocation } from "react-router-dom";
import { INCLUDE_INACTIVE_TASKS } from "constants/cookies";
import { useUpdateURLQueryParams } from "hooks";
import { parseQueryString } from "utils/queryString";

const inactiveTaskQueryParam = "includeInactiveTasks";
interface InactiveTasksToggleProps {
  onChange?: (value: boolean) => void;
}
const InactiveTasksToggle: React.VFC<InactiveTasksToggleProps> = ({
  onChange = () => undefined,
}) => {
  const { search } = useLocation();
  const parsed = parseQueryString(search);
  const updateQueryParams = useUpdateURLQueryParams();

  const includeInactiveTasks =
    parsed[inactiveTaskQueryParam] !== undefined
      ? parsed[inactiveTaskQueryParam] === "true"
      : Cookies.get(INCLUDE_INACTIVE_TASKS) === "true";

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { checked } = e.target;
    updateQueryParams({
      [inactiveTaskQueryParam]: checked.toString(),
    });
    Cookies.set(INCLUDE_INACTIVE_TASKS, checked.toString());
    onChange(checked);
  };

  return (
    <Checkbox
      label="Include Inactive tasks"
      checked={Boolean(includeInactiveTasks)}
      onChange={handleOnChange}
    />
  );
};

export { InactiveTasksToggle, inactiveTaskQueryParam };
