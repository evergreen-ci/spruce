import { render, screen, userEvent } from "test_utils";
import { TreeSelect } from ".";

describe("treeSelect", () => {
  it("renders each value in the tree", () => {
    render(<TreeSelect onChange={() => {}} state={[]} tData={treeData} />);
    expect(screen.getByDataCy("tree-select-options")).toBeInTheDocument();
    for (let i = 0; i < treeData.length; i++) {
      expect(screen.getByText(treeData[i].title)).toBeInTheDocument();
    }
  });

  it("selected elements should be checked", () => {
    render(
      <TreeSelect onChange={() => {}} state={["pass"]} tData={treeData} />
    );
    expect(screen.getByDataCy("tree-select-options")).toBeInTheDocument();
    const checkbox = screen.queryByLabelText("Pass");
    expect(checkbox).toBeChecked();
  });

  it("clicking a value selects its option in the tree select", () => {
    const onChange = jest.fn();
    render(<TreeSelect onChange={onChange} state={[]} tData={treeData} />);
    expect(screen.getByText("Pass")).toBeInTheDocument();
    userEvent.click(screen.queryByText("Pass"));
    expect(onChange).toHaveBeenCalledWith(["pass"]);
  });

  it("clicking all selects all of the options in the tree select", () => {
    const onChange = jest.fn();
    render(<TreeSelect onChange={onChange} state={[]} tData={treeData} />);
    expect(screen.getByText("All")).toBeInTheDocument();
    userEvent.click(screen.queryByText("All"));
    expect(onChange).toHaveBeenCalledWith([
      "all",
      "pass",
      "fail",
      "skip",
      "silent fail",
    ]);
  });

  it("should render nested children", () => {
    render(
      <TreeSelect onChange={() => {}} state={[]} tData={nestedTreeData} />
    );
    expect(screen.getByText("All")).toBeInTheDocument();
    expect(screen.getByText("Failing Umbrella")).toBeInTheDocument();
    expect(screen.getByText("System Failure")).toBeInTheDocument();
    expect(screen.getByText("Fail")).toBeInTheDocument();
  });

  it("unchecking a child element should uncheck its parent", () => {
    let state = ["failing-umbrella", "system-failure", "fail"];
    const onChange = jest.fn((update) => {
      state = update;
    });
    render(
      <TreeSelect onChange={onChange} state={state} tData={nestedTreeData} />
    );
    expect(screen.queryByLabelText("Failing Umbrella")).toBeChecked();
    expect(screen.queryByLabelText("System Failure")).toBeChecked();
    expect(screen.queryByLabelText("Fail")).toBeChecked();
    userEvent.click(screen.queryByText("Fail"));
    expect(onChange).toHaveBeenCalledWith(["system-failure"]);
  });

  it("checking a parent element should toggle its children", () => {
    const onChange = jest.fn();
    render(
      <TreeSelect onChange={onChange} state={[]} tData={nestedTreeData} />
    );
    expect(screen.getByText("Failing Umbrella")).toBeInTheDocument();
    userEvent.click(screen.queryByText("Failing Umbrella"));
    expect(onChange).toHaveBeenCalledWith([
      "failing-umbrella",
      "system-failure",
      "fail",
    ]);
  });
});

const treeData = [
  {
    key: "all",
    title: "All",
    value: "all",
  },
  {
    key: "pass",
    title: "Pass",
    value: "pass",
  },
  {
    key: "fail",
    title: "Fail",
    value: "fail",
  },
  {
    key: "skip",
    title: "Skip",
    value: "skip",
  },
  {
    key: "silent fail",
    title: "Silent Fail",
    value: "silent fail",
  },
];

const nestedTreeData = [
  {
    key: "all",
    title: "All",
    value: "all",
  },
  {
    children: [
      {
        key: "system-failure",
        title: "System Failure",
        value: "system-failure",
      },
      {
        key: "fail",
        title: "Fail",
        value: "fail",
      },
    ],
    key: "failing-umbrella",
    title: "Failing Umbrella",
    value: "failing-umbrella",
  },
  {
    key: "pass",
    title: "Pass",
    value: "pass",
  },
];
