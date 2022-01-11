import { fireEvent, render } from "test_utils";
import { TreeSelect } from ".";

describe("treeSelect", () => {
  it("renders each value in the tree", () => {
    const { queryByText, queryByDataCy } = render(
      <TreeSelect onChange={() => {}} state={[]} tData={treeData} />
    );
    expect(queryByDataCy("tree-select-options")).toBeInTheDocument();
    for (let i = 0; i < treeData.length; i++) {
      expect(queryByText(treeData[i].title)).toBeInTheDocument();
    }
  });
  it("selected elements should be checked", () => {
    const { queryByDataCy, queryByLabelText } = render(
      <TreeSelect onChange={() => {}} state={["pass"]} tData={treeData} />
    );
    expect(queryByDataCy("tree-select-options")).toBeInTheDocument();
    const checkbox = queryByLabelText("Pass");
    expect(checkbox).toBeChecked();
  });
  it("clicking a value selects its option in the tree select", () => {
    const onChange = jest.fn();
    const { queryByText } = render(
      <TreeSelect onChange={onChange} state={[]} tData={treeData} />
    );
    expect(queryByText("Pass")).toBeInTheDocument();
    fireEvent.click(queryByText("Pass"));
    expect(onChange).toHaveBeenCalledWith(["pass"]);
  });
  it("clicking all selects all of the options in the tree select", () => {
    const onChange = jest.fn();
    const { queryByText } = render(
      <TreeSelect onChange={onChange} state={[]} tData={treeData} />
    );
    expect(queryByText("All")).toBeInTheDocument();
    fireEvent.click(queryByText("All"));
    expect(onChange).toHaveBeenCalledWith([
      "all",
      "pass",
      "fail",
      "skip",
      "silent fail",
    ]);
  });

  it("should render nested children", () => {
    const { queryByText } = render(
      <TreeSelect onChange={() => {}} state={[]} tData={nestedTreeData} />
    );
    expect(queryByText("All")).toBeInTheDocument();
    expect(queryByText("Failing Umbrella")).toBeInTheDocument();
    expect(queryByText("System Failure")).toBeInTheDocument();
    expect(queryByText("Fail")).toBeInTheDocument();
  });
  it("unchecking a child element should uncheck its parent", () => {
    let state = ["failing-umbrella", "system-failure", "fail"];
    const onChange = jest.fn((update) => {
      state = update;
    });
    const { queryByText, queryByLabelText } = render(
      <TreeSelect onChange={onChange} state={state} tData={nestedTreeData} />
    );
    expect(queryByLabelText("Failing Umbrella")).toBeChecked();
    expect(queryByLabelText("System Failure")).toBeChecked();
    expect(queryByLabelText("Fail")).toBeChecked();
    fireEvent.click(queryByText("Fail"));
    expect(onChange).toHaveBeenCalledWith(["system-failure"]);
  });
  it("checking a parent element should toggle its children", () => {
    const onChange = jest.fn();
    const { queryByText } = render(
      <TreeSelect onChange={onChange} state={[]} tData={nestedTreeData} />
    );
    expect(queryByText("Failing Umbrella")).toBeInTheDocument();
    fireEvent.click(queryByText("Failing Umbrella"));
    expect(onChange).toHaveBeenCalledWith([
      "failing-umbrella",
      "system-failure",
      "fail",
    ]);
  });
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

const nestedTreeData = [
  {
    title: "All",
    value: "all",
    key: "all",
  },
  {
    title: "Failing Umbrella",
    value: "failing-umbrella",
    key: "failing-umbrella",
    children: [
      {
        title: "System Failure",
        value: "system-failure",
        key: "system-failure",
      },
      {
        title: "Fail",
        value: "fail",
        key: "fail",
      },
    ],
  },
  {
    title: "Pass",
    value: "pass",
    key: "pass",
  },
];
