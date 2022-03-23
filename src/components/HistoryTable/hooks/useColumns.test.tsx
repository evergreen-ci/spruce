import { renderHook } from "@testing-library/react-hooks";
import { MemoryRouter, Route } from "react-router-dom";
import { HistoryQueryParams } from "types/history";
import { useHistoryTableTestHook, ProviderWrapper } from "./test-utils";
import useColumns from "./useColumns";

const RouterProvider = (param?: string) => ({ children, mocks }) => {
  const params = param ? `?${param}` : "";
  return (
    <MemoryRouter initialEntries={[`/${params}`]}>
      <Route path="/" component={() => ProviderWrapper({ children, mocks })} />
    </MemoryRouter>
  );
};

describe("useColumns", () => {
  it("should return no columns when there are none", () => {
    const accessFunc = jest.fn();
    const { result } = renderHook(
      () => useHistoryTableTestHook(useColumns, [[], accessFunc]),
      {
        wrapper: RouterProvider(),
      }
    );

    expect(result.current.hookResponse).toStrictEqual([]);
    expect(result.current.historyTable).toMatchObject({
      visibleColumns: [],
    });
  });

  it("should only return columns if they exist despite params being applied", () => {
    const accessFunc = jest.fn((c) => c);
    const { result } = renderHook(
      () => useHistoryTableTestHook(useColumns, [[], accessFunc]),
      {
        wrapper: RouterProvider(`${HistoryQueryParams.VisibleColumns}=a,b`),
      }
    );

    expect(result.current.hookResponse).toStrictEqual([]);
    expect(result.current.historyTable).toMatchObject({
      visibleColumns: [],
    });
  });

  it("should return all columns if they exist with no params are applied", () => {
    const accessFunc = jest.fn((c) => c);
    const { result } = renderHook(
      () => useHistoryTableTestHook(useColumns, [["a", "b"], accessFunc]),
      {
        wrapper: RouterProvider(),
      }
    );

    expect(result.current.hookResponse).toStrictEqual(["a", "b"]);
    expect(result.current.historyTable).toMatchObject({
      visibleColumns: ["a", "b"],
    });
  });
  it("should only return columns that match the query params", () => {
    const accessFunc = jest.fn((c) => c);
    const { result } = renderHook(
      () => useHistoryTableTestHook(useColumns, [["a", "b"], accessFunc]),
      {
        wrapper: RouterProvider(`${HistoryQueryParams.VisibleColumns}=a`),
      }
    );

    expect(result.current.hookResponse).toStrictEqual(["a"]);
    expect(result.current.historyTable).toMatchObject({
      visibleColumns: ["a"],
    });
  });
});
