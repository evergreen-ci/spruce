/* eslint-disable testing-library/no-node-access */
import { renderHook } from "@testing-library/react-hooks";
import { userEvent } from "test_utils";
import { useTabShortcut } from ".";

const { type } = userEvent;

describe("useTabShortcut", () => {
  it("should call setSelectedTab with the next tab index when the 'j' key is pressed", () => {
    const setSelectedTab = jest.fn();
    let currentTab = 1;
    const { rerender } = renderHook(() =>
      useTabShortcut({ setSelectedTab, currentTab, numTabs: 4 })
    );
    type(document.body, "j");
    expect(setSelectedTab).toHaveBeenCalledWith(2);
    currentTab = 2;
    rerender();
    type(document.body, "j");
    expect(setSelectedTab).toHaveBeenCalledWith(3);
    currentTab = 3;
    rerender();
    type(document.body, "j");
    expect(setSelectedTab).toHaveBeenCalledWith(0);
    currentTab = 0;
    rerender();
    type(document.body, "j");
    expect(setSelectedTab).toHaveBeenCalledWith(1);
  });
  it("should call setSelectedTab with the previous tab index when the 'k' key is pressed", () => {
    const setSelectedTab = jest.fn();
    let currentTab = 1;
    const { rerender } = renderHook(() =>
      useTabShortcut({ setSelectedTab, currentTab, numTabs: 4 })
    );
    type(document.body, "k");
    expect(setSelectedTab).toHaveBeenCalledWith(0);
    currentTab = 0;
    rerender();
    type(document.body, "k");
    expect(setSelectedTab).toHaveBeenCalledWith(3);
    currentTab = 3;
    rerender();
    type(document.body, "k");
    expect(setSelectedTab).toHaveBeenCalledWith(2);
    currentTab = 2;
    rerender();
    type(document.body, "k");
    expect(setSelectedTab).toHaveBeenCalledWith(1);
  });
});
