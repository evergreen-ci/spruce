import { render, fireEvent, within, waitFor } from "test_utils";
import FilterBadges from ".";

describe("filterBadges", () => {
  it("should not render any badges if there are none passed in", () => {
    const onRemove = jest.fn();
    const onClearAll = jest.fn();
    const { queryAllByDataCy } = render(
      <FilterBadges badges={[]} onRemove={onRemove} onClearAll={onClearAll} />
    );
    expect(queryAllByDataCy("filter-badge")).toHaveLength(0);
  });
  it("should render badges if there are some passed in", () => {
    const onRemove = jest.fn();
    const onClearAll = jest.fn();
    const { queryAllByDataCy, queryByText } = render(
      <FilterBadges
        badges={[{ key: "test", value: "value" }]}
        onRemove={onRemove}
        onClearAll={onClearAll}
      />
    );
    expect(queryAllByDataCy("filter-badge")).toHaveLength(1);
    expect(queryByText("test : value")).toBeInTheDocument();
  });
  it("should render a badge for each key/value pair passed in", () => {
    const onRemove = jest.fn();
    const onClearAll = jest.fn();
    const { queryAllByDataCy, queryByText } = render(
      <FilterBadges
        badges={[
          { key: "test", value: "value" },
          { key: "test2", value: "value2" },
        ]}
        onRemove={onRemove}
        onClearAll={onClearAll}
      />
    );
    expect(queryAllByDataCy("filter-badge")).toHaveLength(2);
    expect(queryByText("test : value")).toBeInTheDocument();
    expect(queryByText("test2 : value2")).toBeInTheDocument();
  });
  it("only renders badges up to the limit", () => {
    const onRemove = jest.fn();
    const onClearAll = jest.fn();
    const { queryAllByDataCy, queryByText } = render(
      <FilterBadges
        badges={[
          { key: "test", value: "value" },
          { key: "test2", value: "value2" },
          { key: "test3", value: "value3" },
          { key: "test4", value: "value4" },
          { key: "test5", value: "value5" },
          { key: "test6", value: "value6" },
          { key: "test7", value: "value7" },
          { key: "test8", value: "value8" },
          { key: "test9", value: "value9" },
          { key: "test10", value: "value10" },
        ]}
        onRemove={onRemove}
        onClearAll={onClearAll}
      />
    );
    expect(queryAllByDataCy("filter-badge")).toHaveLength(8);
    expect(queryByText("test : value")).toBeInTheDocument();
    expect(queryByText("test8 : value8")).toBeInTheDocument();
    expect(queryByText("see 2 more")).toBeInTheDocument();
  });
  it("clicking see more should display a modal with all of the badges", () => {
    const onRemove = jest.fn();
    const onClearAll = jest.fn();
    const { queryByDataCy, queryByText } = render(
      <FilterBadges
        badges={[
          { key: "test1", value: "value1" },
          { key: "test2", value: "value2" },
          { key: "test3", value: "value3" },
          { key: "test4", value: "value4" },
          { key: "test5", value: "value5" },
          { key: "test6", value: "value6" },
          { key: "test7", value: "value7" },
          { key: "test8", value: "value8" },
          { key: "test9", value: "value9" },
          { key: "test10", value: "value10" },
        ]}
        onRemove={onRemove}
        onClearAll={onClearAll}
      />
    );
    fireEvent.click(queryByText("see 2 more"));
    expect(queryByDataCy("see-more-modal")).toBeInTheDocument();
    expect(
      within(queryByDataCy("see-more-modal")).queryAllByDataCy("filter-badge")
    ).toHaveLength(10);
    for (let i = 0; i < 10; i++) {
      expect(
        within(queryByDataCy("see-more-modal")).queryByText(
          `test${i + 1} : value${i + 1}`
        )
      ).toBeInTheDocument();
    }
  });
  it("clicking clear all should call the clear all callback", () => {
    const onRemove = jest.fn();
    const onClearAll = jest.fn();
    const { queryByText } = render(
      <FilterBadges
        badges={[
          { key: "test1", value: "value1" },
          { key: "test2", value: "value2" },
          { key: "test3", value: "value3" },
          { key: "test4", value: "value4" },
          { key: "test5", value: "value5" },
          { key: "test6", value: "value6" },
          { key: "test7", value: "value7" },
          { key: "test8", value: "value8" },
          { key: "test9", value: "value9" },
          { key: "test10", value: "value10" },
        ]}
        onRemove={onRemove}
        onClearAll={onClearAll}
      />
    );
    fireEvent.click(queryByText("CLEAR ALL FILTERS"));
    expect(onClearAll).toHaveBeenCalledTimes(1);
  });
  it("clicking a badge should call the remove callback", () => {
    const onRemove = jest.fn();
    const onClearAll = jest.fn();
    const { queryAllByDataCy } = render(
      <FilterBadges
        badges={[
          { key: "test1", value: "value1" },
          { key: "test2", value: "value2" },
          { key: "test3", value: "value3" },
          { key: "test4", value: "value4" },
          { key: "test5", value: "value5" },
          { key: "test6", value: "value6" },
          { key: "test7", value: "value7" },
          { key: "test8", value: "value8" },
          { key: "test9", value: "value9" },
          { key: "test10", value: "value10" },
        ]}
        onRemove={onRemove}
        onClearAll={onClearAll}
      />
    );
    const closeBadge = queryAllByDataCy("close-badge")[0];
    expect(closeBadge).toBeInTheDocument();
    fireEvent.click(closeBadge);
    expect(onRemove).toHaveBeenCalledWith({ key: "test1", value: "value1" });
  });
  it("should truncate a badge value if it is too long", async () => {
    const onRemove = jest.fn();
    const onClearAll = jest.fn();
    const longName = "this is a really long name that should be truncated";
    const { queryByDataCy, queryByText } = render(
      <FilterBadges
        badges={[{ key: "some", value: longName }]}
        onRemove={onRemove}
        onClearAll={onClearAll}
      />
    );
    const truncatedBadge = queryByDataCy("filter-badge");
    expect(truncatedBadge).toBeInTheDocument();
    expect(truncatedBadge).not.toHaveTextContent(longName);
    fireEvent.mouseEnter(queryByDataCy("filter-badge"));
    await waitFor(() => {
      expect(queryByText(longName)).toBeVisible();
    });
  });
});
