import { useState } from "react";
import { useUpsertQueryParams } from "hooks";
import { renderWithRouterMatch as render, fireEvent } from "test_utils";

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
  it.skip("renders normally and doesn't affect the url", () => {
    const { history } = render(<Content />, {
      route: "/",
      path: "/",
    });

    expect(history.location.search).toBe("");
  });

  it.skip("should add input query params to the url if none exist", () => {
    const { queryByDataCy, history } = render(<Content />, {
      route: "/",
      path: "/",
    });
    const category = queryByDataCy("category");
    const value = queryByDataCy("value");

    fireEvent.change(category, {
      target: { value: "category" },
    });
    fireEvent.change(value, {
      target: { value: "value" },
    });
    fireEvent.click(queryByDataCy("submit"));

    expect(history.location.search).toBe(`?category=value`);
  });

  it("should add multiple input filters to the same key as query params", () => {
    const { queryByDataCy, history } = render(<Content />, {
      route: "/",
      path: "/",
    });

    const category = queryByDataCy("category");
    const value = queryByDataCy("value");
    fireEvent.change(category, {
      target: { value: "category" },
    });
    fireEvent.change(value, {
      target: { value: "value1" },
    });
    console.log("before 1st submit", history.location.search);
    fireEvent.click(queryByDataCy("submit"));
    console.log("right after 1st submit", history.location.search);
    expect(history.location.search).toBe(`?category=value1`);
    fireEvent.change(value, {
      target: { value: "value2" },
    });
    console.log("right after 2nd change event", history.location.search);

    fireEvent.click(queryByDataCy("submit"));
    expect(history.location.search).toBe(`?category=value1,value2`);
  });

  it.skip("should not allow duplicate input filters for the same key as query params", () => {
    const { queryByDataCy, history } = render(<Content />, {
      route: "/",
      path: "/",
    });
    const category = queryByDataCy("category");
    const value = queryByDataCy("value");
    fireEvent.change(category, {
      target: { value: "category" },
    });
    fireEvent.change(value, {
      target: { value: "value1" },
    });
    fireEvent.click(queryByDataCy("submit"));

    expect(history.location.search).toBe(`?category=value1`);

    fireEvent.change(value, {
      target: { value: "value1" },
    });
    fireEvent.click(queryByDataCy("submit"));

    expect(history.location.search).toBe(`?category=value1`);
  });

  it.skip("should allow multiple input filters for different keys as query params", async () => {
    const { queryByDataCy, history } = render(<Content />, {
      route: "/",
      path: "/",
    });
    const category = queryByDataCy("category");
    const value = queryByDataCy("value");
    fireEvent.change(category, {
      target: { value: "category" },
    });
    fireEvent.change(value, {
      target: { value: "value1" },
    });
    fireEvent.click(queryByDataCy("submit"));

    expect(history.location.search).toBe(`?category=value1`);

    fireEvent.change(category, {
      target: { value: "category2" },
    });
    fireEvent.click(queryByDataCy("submit"));
    expect(history.location.search).toBe(`?category=value1&category2=value1`);
  });
});
