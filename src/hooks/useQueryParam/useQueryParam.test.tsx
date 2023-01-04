import { act, renderHook } from "@testing-library/react-hooks";
import { MemoryRouter } from "react-router-dom";
import { useQueryParam, useQueryParams } from ".";

describe("useQueryParams", () => {
  it("should return the correct query string", () => {
    const wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
      <MemoryRouter initialEntries={["/?search=test"]}>{children}</MemoryRouter>
    );

    const { result } = renderHook(() => useQueryParams(), {
      wrapper,
    });
    expect(result.current[0].search).toBe("test");
  });
  it("setting a query string should update the query string", () => {
    const wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
      <MemoryRouter initialEntries={["/?search=test"]}>{children}</MemoryRouter>
    );
    const { result } = renderHook(() => useQueryParams(), {
      wrapper,
    });
    act(() => {
      result.current[1]({ search: "test2" });
    });
    expect(result.current[0].search).toBe("test2");
  });
});

const useQueryJointHook = (param: string, def: any) => {
  const [queryParam, setQueryParam] = useQueryParam(param, def);
  const [allQueryParams] = useQueryParams();
  return { queryParam, setQueryParam, allQueryParams };
};

describe("useQueryParam", () => {
  it("setting a query param value should not update other values", () => {
    const wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
      <MemoryRouter initialEntries={["/?search=test"]}>{children}</MemoryRouter>
    );
    const { result } = renderHook(() => useQueryJointHook("other", ""), {
      wrapper,
    });
    expect(result.current.allQueryParams).toMatchObject({ search: "test" });
    act(() => {
      result.current.setQueryParam("test2");
    });
    expect(result.current.queryParam).toBe("test2");
    expect(result.current.allQueryParams).toMatchObject({
      other: "test2",
      search: "test",
    });
  });
  it("query param should be the default value if not set", () => {
    const wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
      <MemoryRouter initialEntries={["/"]}>{children}</MemoryRouter>
    );
    const { result } = renderHook(() => useQueryJointHook("other", "default"), {
      wrapper,
    });
    expect(result.current.queryParam).toBe("default");
  });
  it("query param should not be default if it exists", () => {
    const wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
      <MemoryRouter initialEntries={["/?other=something"]}>
        {children}
      </MemoryRouter>
    );
    const { result } = renderHook(() => useQueryJointHook("other", "default"), {
      wrapper,
    });
    expect(result.current.queryParam).toBe("something");
  });

  describe("should handle strings", () => {
    it("when a default is provided", () => {
      const wrapper: React.FC<{ children: React.ReactNode }> = ({
        children,
      }) => (
        <MemoryRouter initialEntries={["/?search=test"]}>
          {children}
        </MemoryRouter>
      );
      const { result } = renderHook(() => useQueryJointHook("search", "test"), {
        wrapper,
      });
      expect(result.current.queryParam).toBe("test");
      act(() => {
        result.current.setQueryParam("test2");
      });
      expect(result.current.queryParam).toBe("test2");
    });
    it("when a default is not provided", () => {
      const wrapper: React.FC<{ children: React.ReactNode }> = ({
        children,
      }) => <MemoryRouter initialEntries={["/"]}>{children}</MemoryRouter>;
      const { result } = renderHook(() => useQueryJointHook("search", "test"), {
        wrapper,
      });
      expect(result.current.queryParam).toBe("test");
      act(() => {
        result.current.setQueryParam("test2");
      });
      expect(result.current.queryParam).toBe("test2");
    });
  });
  describe("should handle numbers", () => {
    it("when a default is provided", () => {
      const wrapper: React.FC<{ children: React.ReactNode }> = ({
        children,
      }) => (
        <MemoryRouter initialEntries={["/?search=1"]}>{children}</MemoryRouter>
      );
      const { result } = renderHook(() => useQueryJointHook("search", 1), {
        wrapper,
      });
      expect(result.current.queryParam).toBe(1);
      act(() => {
        result.current.setQueryParam(2);
      });
      expect(result.current.queryParam).toBe(2);
    });
    it("when a default is not provided", () => {
      const wrapper: React.FC<{ children: React.ReactNode }> = ({
        children,
      }) => <MemoryRouter initialEntries={["/"]}>{children}</MemoryRouter>;
      const { result } = renderHook(() => useQueryJointHook("search", 1), {
        wrapper,
      });
      expect(result.current.queryParam).toBe(1);
      act(() => {
        result.current.setQueryParam(2);
      });
      expect(result.current.queryParam).toBe(2);
    });
  });
  describe("should handle booleans", () => {
    it("when a default is provided", () => {
      const wrapper: React.FC<{ children: React.ReactNode }> = ({
        children,
      }) => (
        <MemoryRouter initialEntries={["/?search=true"]}>
          {children}
        </MemoryRouter>
      );
      const { result } = renderHook(() => useQueryJointHook("search", true), {
        wrapper,
      });
      expect(result.current.queryParam).toBe(true);
      act(() => {
        result.current.setQueryParam(false);
      });
      expect(result.current.queryParam).toBe(false);
    });
    it("when a default is not provided", () => {
      const wrapper: React.FC<{ children: React.ReactNode }> = ({
        children,
      }) => <MemoryRouter initialEntries={["/"]}>{children}</MemoryRouter>;
      const { result } = renderHook(() => useQueryJointHook("search", true), {
        wrapper,
      });
      expect(result.current.queryParam).toBe(true);
      act(() => {
        result.current.setQueryParam(false);
      });
      expect(result.current.queryParam).toBe(false);
    });
  });
  describe("should handle arrays", () => {
    it("when a default is provided", () => {
      const wrapper: React.FC<{ children: React.ReactNode }> = ({
        children,
      }) => (
        <MemoryRouter initialEntries={["/?search=1"]}>{children}</MemoryRouter>
      );
      const { result } = renderHook(() => useQueryJointHook("search", [1]), {
        wrapper,
      });
      expect(result.current.queryParam).toStrictEqual([1]);
      act(() => {
        result.current.setQueryParam([2]);
      });
      expect(result.current.queryParam).toStrictEqual([2]);
      act(() => {
        result.current.setQueryParam([3, 4]);
      });
      expect(result.current.queryParam).toStrictEqual([3, 4]);
    });
    it("when a default is not provided", () => {
      const wrapper: React.FC<{ children: React.ReactNode }> = ({
        children,
      }) => <MemoryRouter initialEntries={["/"]}>{children}</MemoryRouter>;
      const { result } = renderHook(() => useQueryJointHook("search", [1]), {
        wrapper,
      });
      expect(result.current.queryParam).toStrictEqual([1]);
      act(() => {
        result.current.setQueryParam([2]);
      });
      expect(result.current.queryParam).toStrictEqual([2]);
      act(() => {
        result.current.setQueryParam([3, 4]);
      });
      expect(result.current.queryParam).toStrictEqual([3, 4]);
    });
  });
});
