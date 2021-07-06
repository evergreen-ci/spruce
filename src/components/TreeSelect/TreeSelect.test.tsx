import { fireEvent, render } from "test_utils/test-utils";
import { Dropdown, TreeSelect } from ".";

test("Dropdown renders contents of render prop when provided", () => {
  const { queryByDataCy } = render(
    <Dropdown
      data-cy="test-status-select"
      inputLabel="Test Status:  "
      render={({ getDropdownProps }) => (
        <TreeSelect
          {...getDropdownProps()}
          onChange={() => {}}
          state={[]}
          tData={treeData}
        />
      )}
    />
  );
  expect(queryByDataCy("tree-select-options")).not.toBeInTheDocument();
  fireEvent.click(queryByDataCy("test-status-select").firstElementChild);
  expect(queryByDataCy("tree-select-options")).toBeInTheDocument();
});

const treeData = [
  {
    title: "All",
    value: "all",
    key: "all",
  },
  {
    title: "Pass",
    value: "pass",
    key: "pass",
  },
  {
    title: "Fail",
    value: "fail",
    key: "fail",
  },
  {
    title: "Skip",
    value: "skip",
    key: "skip",
  },
  {
    title: "Silent Fail",
    value: "silent fail",
    key: "silent fail",
  },
];
