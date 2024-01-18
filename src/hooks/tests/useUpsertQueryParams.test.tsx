import { useState } from "react";
import { useUpsertQueryParams } from "hooks";
import { renderWithRouterMatch, screen, userEvent } from "test_utils";

const Content = () => {
  const onSubmit = useUpsertQueryParams();
  const [category, setCategory] = useState("");
  const [value, setValue] = useState("");
  return (
    <>
      <input
        data-cy="category"
        type="text"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      />
      <input
        data-cy="value"
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <button
        data-cy="submit"
        type="button"
        onClick={() => onSubmit({ category, value })}
      >
        Submit
      </button>
    </>
  );
};
describe("useUpsertQueryParams", () => {
  it("renders normally and doesn't affect the url", () => {
    const { router } = renderWithRouterMatch(<Content />);
    expect(router.state.location.search).toBe("");
  });

  it("should add input query params to the url if none exist", async () => {
    const user = userEvent.setup();
    const { router } = renderWithRouterMatch(<Content />);
    const category = screen.queryByDataCy("category");
    const value = screen.queryByDataCy("value");

    await user.type(category, "category");
    await user.type(value, "value");
    await user.click(screen.queryByDataCy("submit"));
    expect(router.state.location.search).toBe(`?category=value`);
  });

  it("should add multiple input filters to the same key as query params", async () => {
    const user = userEvent.setup();
    const { router } = renderWithRouterMatch(<Content />);

    const category = screen.queryByDataCy("category");
    const value = screen.queryByDataCy("value");
    await user.type(category, "category");
    await user.type(value, "value1");
    await user.click(screen.queryByDataCy("submit"));
    expect(router.state.location.search).toBe(`?category=value1`);

    await user.clear(value);
    await user.type(value, "value2");
    await user.click(screen.queryByDataCy("submit"));
    expect(router.state.location.search).toBe(`?category=value1,value2`);
  });

  it("should not allow duplicate input filters for the same key as query params", async () => {
    const user = userEvent.setup();
    const { router } = renderWithRouterMatch(<Content />);
    const category = screen.queryByDataCy("category");
    const value = screen.queryByDataCy("value");
    await user.type(category, "category");
    await user.type(value, "value1");
    await user.click(screen.queryByDataCy("submit"));
    expect(router.state.location.search).toBe(`?category=value1`);

    await user.clear(value);
    await user.type(value, "value1");
    await user.click(screen.queryByDataCy("submit"));
    expect(router.state.location.search).toBe(`?category=value1`);
  });

  it("should allow multiple input filters for different keys as query params", async () => {
    const user = userEvent.setup();
    const { router } = renderWithRouterMatch(<Content />);
    const category = screen.queryByDataCy("category");
    const value = screen.queryByDataCy("value");
    await user.type(category, "category");
    await user.type(value, "value1");
    await user.click(screen.queryByDataCy("submit"));
    expect(router.state.location.search).toBe(`?category=value1`);

    await user.clear(category);
    await user.type(category, "category2");
    await user.click(screen.queryByDataCy("submit"));
    expect(router.state.location.search).toBe(
      `?category=value1&category2=value1`,
    );
  });
});
