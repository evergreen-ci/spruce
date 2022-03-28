import { renderHook, act } from "@testing-library/react-hooks";
import { CommitsProvider, useCommits } from "./CommitsContext";

const wrapper = ({ children }) => <CommitsProvider>{children}</CommitsProvider>;

describe("historyTableContext", () => {
  it("initializes with the default state", () => {
    const { result } = renderHook(() => useCommits(), { wrapper });
    expect(result.current).toStrictEqual({
      hoveredTaskIcon: null,
      setTaskIcon: expect.any(Function),
    });
  });
  it("should properly update the selectedTaskIcon", () => {
    const { result } = renderHook(() => useCommits(), { wrapper });
    const hoverTask = "ubuntu-1604check_codegen";
    act(() => {
      result.current.setTaskIcon(hoverTask);
    });
    expect(result.current.hoveredTaskIcon).toBe(hoverTask);
  });
});
