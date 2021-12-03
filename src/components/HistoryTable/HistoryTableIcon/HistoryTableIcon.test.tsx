import { render, fireEvent, waitFor } from "test_utils/test-utils";
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
    expect(onClick).toHaveBeenCalled();
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
    const { queryByDataCy, queryByText } = render(
      <HistoryTableIcon
        status={TaskStatus.Succeeded}
        failingTests={failingTests}
      />
    );
    const icon = queryByDataCy("history-table-icon");
    expect(icon).toBeInTheDocument();
    fireEvent.mouseOver(icon);
    await waitFor(() => {
      expect(queryByText("test a")).toBeVisible();
    });
  });
});

const failingTests = [
  "test a",
  "test b",
  "test c",
  "test looooonnnnnnnng name",
  "some other test",
  "test name d",
];
