import { render, screen, userEvent } from "test_utils";
import PageSizeSelector from ".";

describe("pageSizeSelector", () => {
  it("selecting page size should call onChange prop", async () => {
    const user = userEvent.setup();
    const onChange = jest.fn();
    render(
      <PageSizeSelector
        data-cy="page-size-selector"
        value={10}
        onChange={onChange}
      />,
    );
    await user.click(screen.getByRole("button", { name: "10 / page" }));
    expect(screen.queryByText("20 / page")).toBeVisible();
    await user.click(screen.queryByText("20 / page"));
    expect(onChange).toHaveBeenCalledWith(20);
  });
});
