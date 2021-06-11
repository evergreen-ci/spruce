import { renderHook, act } from "@testing-library/react-hooks";
import { useFilterInputChangeHandler } from "hooks";
import { waitFor } from "test_utils/test-utils";

const URL_QUERY_PARAM = "query-param";
const mockReplace = jest.fn();
const INIT_VALUE = "WazzupWorld";
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useLocation: () => ({
    pathname: "localhost:3000/example/path",
    search: `${URL_QUERY_PARAM}=${INIT_VALUE}&page=4`,
  }),
  useHistory: () => ({
    replace: mockReplace,
  }),
}));

test("value should initialize with data from url query param", () => {
  const { result } = renderHook(() =>
    useFilterInputChangeHandler(URL_QUERY_PARAM, true, () => {})
  );
  const [value] = result.current;
  expect(value).toStrictEqual(INIT_VALUE);
});

test("value should change when updateAndSubmitWithDebounce is called", () => {
  const { result } = renderHook(() =>
    useFilterInputChangeHandler(URL_QUERY_PARAM, true, () => {})
  );
  const [, updateAndSubmitWithDebounce] = result.current;
  const e = {
    target: { value: "some new thang" },
  } as React.ChangeEvent<HTMLInputElement>;
  act(() => {
    updateAndSubmitWithDebounce(e);
  });
  const [value] = result.current;
  expect(value).toStrictEqual("some new thang");
});

test("value should change when updateOnly is called", () => {
  const analyticsMock = jest.fn();
  const { result } = renderHook(() =>
    useFilterInputChangeHandler(URL_QUERY_PARAM, true, analyticsMock)
  );
  const [, updateAndSubmitWithDebounce] = result.current;
  const e = {
    target: { value: "some new thang" },
  } as React.ChangeEvent<HTMLInputElement>;
  act(() => {
    updateAndSubmitWithDebounce(e);
  });
  const [value] = result.current;
  expect(value).toStrictEqual("some new thang");
});

describe("value should not change and history replace function should be called when submitOnly is called.", () => {
  test("with resetPage set true", () => {
    const { result } = renderHook(() =>
      useFilterInputChangeHandler(URL_QUERY_PARAM, true, () => {})
    );
    const [value] = result.current;
    expect(value).toStrictEqual(INIT_VALUE);

    const [, , , submitOnly] = result.current;
    act(() => {
      submitOnly();
    });
    expect(value).toStrictEqual(INIT_VALUE);
    expect(mockReplace).toHaveBeenLastCalledWith(
      "localhost:3000/example/path?page=0&query-param=WazzupWorld"
    );
  });

  test("with resetPage set false", () => {
    const { result } = renderHook(() =>
      useFilterInputChangeHandler(URL_QUERY_PARAM, false, () => {})
    );
    const [value] = result.current;
    expect(value).toStrictEqual(INIT_VALUE);

    const [, , , submitOnly] = result.current;
    act(() => {
      submitOnly();
    });
    expect(value).toStrictEqual(INIT_VALUE);
    expect(mockReplace).toHaveBeenLastCalledWith(
      "localhost:3000/example/path?page=4&query-param=WazzupWorld"
    );
  });
});

test("value should clear when reset is called", () => {
  const { result } = renderHook(() =>
    useFilterInputChangeHandler(URL_QUERY_PARAM, true, () => {})
  );
  const [value] = result.current;
  expect(value).toStrictEqual(INIT_VALUE);

  const [, , , , reset] = result.current;
  act(() => {
    reset();
  });
  waitFor(() => expect(value).toStrictEqual(""));
});

describe("replace should be called when reset is called", () => {
  test("page # set to 0 when 'resetPage' is true", () => {
    const { result } = renderHook(() =>
      useFilterInputChangeHandler(URL_QUERY_PARAM, true, () => {})
    );
    const [value] = result.current;
    expect(value).toStrictEqual(INIT_VALUE);

    const [, , , , reset] = result.current;
    act(() => {
      reset();
    });
    waitFor(() => expect(value).toStrictEqual(""));
    expect(mockReplace).toHaveBeenLastCalledWith(
      "localhost:3000/example/path?page=0"
    );
  });

  test("page # unchanged when 'resetPage' is false", () => {
    const { result } = renderHook(() =>
      useFilterInputChangeHandler(URL_QUERY_PARAM, false, () => {})
    );
    const [value] = result.current;
    expect(value).toStrictEqual(INIT_VALUE);

    const [, , , , reset] = result.current;
    act(() => {
      reset();
    });
    waitFor(() => expect(value).toStrictEqual(""));
    expect(mockReplace).toHaveBeenLastCalledWith(
      "localhost:3000/example/path?page=4"
    );
  });
});
