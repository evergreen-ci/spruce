import { renderHook, userEvent } from "test_utils";
import { useTabShortcut } from ".";

describe("useTabShortcut", () => {
  it("should call setSelectedTab with the next tab index when the 'j' key is pressed", async () => {
    const user = userEvent.setup();
    const setSelectedTab = jest.fn();
    let currentTab = 1;
    const { rerender } = renderHook(() =>
      useTabShortcut({ setSelectedTab, currentTab, numTabs: 4 }),
    );
    await user.keyboard("{j}");
    expect(setSelectedTab).toHaveBeenCalledWith(2);
    currentTab = 2;
    rerender();
    await user.keyboard("{j}");
    expect(setSelectedTab).toHaveBeenCalledWith(3);
    currentTab = 3;
    rerender();
    await user.keyboard("{j}");
    expect(setSelectedTab).toHaveBeenCalledWith(0);
    currentTab = 0;
    rerender();
    await user.keyboard("{j}");
    expect(setSelectedTab).toHaveBeenCalledWith(1);
  });
  it("should call setSelectedTab with the previous tab index when the 'k' key is pressed", async () => {
    const user = userEvent.setup();
    const setSelectedTab = jest.fn();
    let currentTab = 1;
    const { rerender } = renderHook(() =>
      useTabShortcut({ setSelectedTab, currentTab, numTabs: 4 }),
    );
    await user.keyboard("{k}");
    expect(setSelectedTab).toHaveBeenCalledWith(0);
    currentTab = 0;
    rerender();
    await user.keyboard("{k}");
    expect(setSelectedTab).toHaveBeenCalledWith(3);
    currentTab = 3;
    rerender();
    await user.keyboard("{k}");
    expect(setSelectedTab).toHaveBeenCalledWith(2);
    currentTab = 2;
    rerender();
    await user.keyboard("{k}");
    expect(setSelectedTab).toHaveBeenCalledWith(1);
  });
});
