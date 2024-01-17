import { render, screen, userEvent, waitFor, within } from "test_utils";
import FilterBadges from ".";

describe("filterBadges", () => {
  it("should not render any badges if there are none passed in", () => {
    const onRemove = jest.fn();
    const onClearAll = jest.fn();
    render(
      <FilterBadges badges={[]} onRemove={onRemove} onClearAll={onClearAll} />,
    );
    expect(screen.queryAllByDataCy("filter-badge")).toHaveLength(0);
  });

  it("should render badges if there are some passed in", () => {
    render(
      <FilterBadges
        badges={[{ key: "test", value: "value" }]}
        onRemove={jest.fn()}
        onClearAll={jest.fn()}
      />,
    );
    expect(screen.queryAllByDataCy("filter-badge")).toHaveLength(1);
    expect(screen.getByText("test: value")).toBeInTheDocument();
  });

  it("should render a badge for each key/value pair passed in", () => {
    render(
      <FilterBadges
        badges={[
          { key: "test", value: "value" },
          { key: "test2", value: "value2" },
        ]}
        onRemove={jest.fn()}
        onClearAll={jest.fn()}
      />,
    );
    expect(screen.queryAllByDataCy("filter-badge")).toHaveLength(2);
    expect(screen.getByText("test: value")).toBeInTheDocument();
    expect(screen.getByText("test2: value2")).toBeInTheDocument();
  });

  it("only renders badges up to the limit", () => {
    render(
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
        onRemove={jest.fn()}
        onClearAll={jest.fn()}
      />,
    );
    expect(screen.queryAllByDataCy("filter-badge")).toHaveLength(8);
    expect(screen.getByText("test: value")).toBeInTheDocument();
    expect(screen.getByText("test8: value8")).toBeInTheDocument();
    expect(screen.getByText("see 2 more")).toBeInTheDocument();
  });

  it("clicking see more should display a modal with all of the badges", async () => {
    const user = userEvent.setup();
    render(
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
        onRemove={jest.fn()}
        onClearAll={jest.fn()}
      />,
    );
    await user.click(screen.queryByText("see 2 more"));
    expect(screen.getByDataCy("see-more-modal")).toBeInTheDocument();
    expect(
      within(screen.queryByDataCy("see-more-modal")).queryAllByDataCy(
        "filter-badge",
      ),
    ).toHaveLength(10);
    for (let i = 0; i < 10; i++) {
      expect(
        within(screen.getByDataCy("see-more-modal")).getByText(
          `test${i + 1}: value${i + 1}`,
        ),
      ).toBeInTheDocument();
    }
  });

  it("clicking clear all should call the clear all callback", async () => {
    const user = userEvent.setup();
    const onClearAll = jest.fn();
    render(
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
        onRemove={jest.fn()}
        onClearAll={onClearAll}
      />,
    );
    await user.click(screen.getByRole("button", { name: "CLEAR ALL FILTERS" }));
    expect(onClearAll).toHaveBeenCalledTimes(1);
  });

  it("clicking a badge should call the remove callback", async () => {
    const user = userEvent.setup();
    const onRemove = jest.fn();
    render(
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
        onClearAll={jest.fn()}
      />,
    );
    const closeBadge = screen.queryAllByDataCy("close-badge")[0];
    expect(closeBadge).toBeInTheDocument();
    await user.click(closeBadge);
    expect(onRemove).toHaveBeenCalledWith({ key: "test1", value: "value1" });
  });

  it("should truncate a badge value if it is too long", async () => {
    const user = userEvent.setup();
    const longName = "this is a really long name that should be truncated";
    render(
      <FilterBadges
        badges={[{ key: "some", value: longName }]}
        onRemove={jest.fn()}
        onClearAll={jest.fn()}
      />,
    );
    const truncatedBadge = screen.queryByDataCy("filter-badge");
    expect(truncatedBadge).toBeInTheDocument();
    expect(truncatedBadge).not.toHaveTextContent(longName);
    await user.hover(truncatedBadge);
    await waitFor(() => {
      expect(screen.queryByText(longName)).toBeVisible();
    });
  });
});
