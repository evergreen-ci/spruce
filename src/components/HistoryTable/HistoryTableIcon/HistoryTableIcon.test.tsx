import { render, fireEvent } from "test_utils";
import { TaskStatus } from "types/task";
import { HistoryTableIcon } from ".";

describe("historyTableIcon", () => {
  it("clicking on the icon performs an action", () => {
    const onClick = jest.fn();
    const { queryByDataCy } = render(
      <HistoryTableIcon status={TaskStatus.Succeeded} onClick={onClick} />
    );
    const icon = queryByDataCy("history-table-icon");
    expect(icon).toBeInTheDocument();
    fireEvent.click(icon);
    expect(onClick).toHaveBeenCalledWith();
  });
  it("hovering over the icon when there no failing tests shouldn't open a tooltip", () => {
    const { queryByDataCy, queryByText } = render(
      <HistoryTableIcon status={TaskStatus.Succeeded} />
    );
    const icon = queryByDataCy("history-table-icon");
    expect(icon).toBeInTheDocument();
    fireEvent.mouseOver(icon);
    expect(queryByText("test a")).not.toBeInTheDocument();
  });
  it("hovering over the icon when there are failing tests should open a tooltip", async () => {
    const { queryByDataCy, queryByText, findByText } = render(
      <HistoryTableIcon
        status={TaskStatus.Succeeded}
        failingTests={failingTests}
      />
    );
    const icon = queryByDataCy("history-table-icon");
    expect(icon).toBeInTheDocument();
    fireEvent.mouseOver(icon);
    await findByText("test a");
    expect(queryByText("test a")).toBeInTheDocument();
  });
});

const failingTests = [
  { testName: "test a", testId: "1" },
  { testName: "test b", testId: "2" },
  { testName: "test c", testId: "3" },
  { testName: "test looooonnnnnnnng name", testId: "4" },
  { testName: "some other test", testId: "5" },
  { testName: "test name d", testId: "6" },
];
