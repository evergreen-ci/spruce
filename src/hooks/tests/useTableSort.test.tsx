import { MemoryRouter, useLocation } from "react-router-dom";
import { act, renderHook } from "test_utils";
import { useTableSort } from "../useTableSort";

describe("useTableSort", () => {
  it("sets ascending sort", () => {
    const analytics = jest.fn();
    const wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
      <MemoryRouter initialEntries={["/?page=0"]}>{children}</MemoryRouter>
    );

    const { result } = renderHook(
      () => ({
        location: useLocation(),
        sort: useTableSort({ sendAnalyticsEvents: analytics }),
      }),
      {
        wrapper,
      },
    );
    act(() => {
      result.current.sort([{ id: "distroId", desc: false }]);
    });
    expect(result.current.location.search).toBe(
      "?page=0&sortBy=distroId&sortDir=ASC",
    );
    expect(analytics).toHaveBeenCalledTimes(1);
  });

  it("sets descending sort", () => {
    const analytics = jest.fn();
    const wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
      <MemoryRouter initialEntries={["/?page=0"]}>{children}</MemoryRouter>
    );

    const { result } = renderHook(
      () => ({
        location: useLocation(),
        sort: useTableSort({ sendAnalyticsEvents: analytics }),
      }),
      {
        wrapper,
      },
    );
    act(() => {
      result.current.sort([{ id: "distroId", desc: true }]);
    });
    expect(result.current.location.search).toBe(
      "?page=0&sortBy=distroId&sortDir=DESC",
    );
    expect(analytics).toHaveBeenCalledTimes(1);
  });

  it("overwrites existing sort", () => {
    const analytics = jest.fn();
    const wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
      <MemoryRouter initialEntries={["/?page=0&sortBy=foo&sortDir=ASC"]}>
        {children}
      </MemoryRouter>
    );

    const { result } = renderHook(
      () => ({
        location: useLocation(),
        sort: useTableSort({ sendAnalyticsEvents: analytics }),
      }),
      {
        wrapper,
      },
    );
    act(() => {
      result.current.sort([{ id: "bar", desc: false }]);
    });
    expect(result.current.location.search).toBe(
      "?page=0&sortBy=bar&sortDir=ASC",
    );
    expect(analytics).toHaveBeenCalledTimes(1);
  });

  it("resets page to zero on sort", () => {
    const analytics = jest.fn();
    const wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
      <MemoryRouter initialEntries={["/?page=1"]}>{children}</MemoryRouter>
    );

    const { result } = renderHook(
      () => ({
        location: useLocation(),
        sort: useTableSort({ sendAnalyticsEvents: analytics }),
      }),
      {
        wrapper,
      },
    );
    act(() => {
      result.current.sort([{ id: "foo", desc: false }]);
    });
    expect(result.current.location.search).toBe(
      "?page=0&sortBy=foo&sortDir=ASC",
    );
    expect(analytics).toHaveBeenCalledTimes(1);
  });

  it("clears sort", () => {
    const analytics = jest.fn();
    const wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
      <MemoryRouter initialEntries={["/?page=0&sortBy=foo&sortDir=ASC"]}>
        {children}
      </MemoryRouter>
    );

    const { result } = renderHook(
      () => ({
        location: useLocation(),
        sort: useTableSort({ sendAnalyticsEvents: analytics }),
      }),
      {
        wrapper,
      },
    );
    act(() => {
      result.current.sort([]);
    });
    expect(result.current.location.search).toBe("?page=0");
    expect(analytics).toHaveBeenCalledTimes(1);
  });
});
