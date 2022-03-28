import { renderHook, act } from "@testing-library/react-hooks";
import { CommitsProvider, useCommits } from "./CommitsContext";

const wrapper = ({ children }) => <CommitsProvider>{children}</CommitsProvider>;

describe("commitsContext", () => {
  it("initializes with the default state", () => {
    const { result } = renderHook(() => useCommits(), { wrapper });
    expect(result.current).toStrictEqual({
      hoveredTaskIcon: null,
      setTaskIcon: expect.any(Function),
    });
  });
  it("should properly update the selectedTaskIcon", async () => {
    const { result, waitForNextUpdate } = renderHook(() => useCommits(), {
      wrapper,
    });
    const hoverTask = "ubuntu-1604-check_codegen";
    act(() => {
      result.current.setTaskIcon(hoverTask);
    });
    await waitForNextUpdate();
    expect(result.current.hoveredTaskIcon).toBe(hoverTask);
  });
});
