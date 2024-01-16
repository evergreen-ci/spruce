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
      <TreeSelect onChange={() => {}} state={["pass"]} tData={treeData} />,
    );
    expect(screen.getByDataCy("tree-select-options")).toBeInTheDocument();
    const checkbox = screen.queryByLabelText("Pass");
    expect(checkbox).toBeChecked();
  });

  it("clicking a value selects its option in the tree select", async () => {
    const user = userEvent.setup();
    const onChange = jest.fn();
    render(<TreeSelect onChange={onChange} state={[]} tData={treeData} />);
    expect(screen.getByText("Pass")).toBeInTheDocument();
    await user.click(screen.queryByText("Pass"));
    expect(onChange).toHaveBeenCalledWith(["pass"]);
  });

  it("clicking all selects all of the options in the tree select", async () => {
    const user = userEvent.setup();
    const onChange = jest.fn();
    render(<TreeSelect onChange={onChange} state={[]} tData={treeData} />);
    expect(screen.getByText("All")).toBeInTheDocument();
    await user.click(screen.queryByText("All"));
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
      <TreeSelect onChange={() => {}} state={[]} tData={nestedTreeData} />,
    );
    expect(screen.getByText("All")).toBeInTheDocument();
    expect(screen.getByText("Failing Umbrella")).toBeInTheDocument();
    expect(screen.getByText("System Failure")).toBeInTheDocument();
    expect(screen.getByText("Fail")).toBeInTheDocument();
  });

  it("unchecking a child element should uncheck its parent", async () => {
    const user = userEvent.setup();
    let state = ["failing-umbrella", "system-failure", "fail"];
    const onChange = jest.fn((update) => {
      state = update;
    });
    render(
      <TreeSelect onChange={onChange} state={state} tData={nestedTreeData} />,
    );
    expect(screen.queryByLabelText("Failing Umbrella")).toBeChecked();
    expect(screen.queryByLabelText("System Failure")).toBeChecked();
    expect(screen.queryByLabelText("Fail")).toBeChecked();
    await user.click(screen.queryByText("Fail"));
    expect(onChange).toHaveBeenCalledWith(["system-failure"]);
  });

  it("checking a parent element should toggle its children", async () => {
    const user = userEvent.setup();
    const onChange = jest.fn();
    render(
      <TreeSelect onChange={onChange} state={[]} tData={nestedTreeData} />,
    );
    expect(screen.getByText("Failing Umbrella")).toBeInTheDocument();
    await user.click(screen.queryByText("Failing Umbrella"));
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
