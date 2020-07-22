import { fireEvent } from "@testing-library/dom";
import { renderHook, act } from "@testing-library/react-hooks";

import { usePollMonitor } from "hooks";

test("usePollMonitor should return online when the users browser is online and polling to not have been interrupted", () => {
  const startPolling = jest.fn();
  const stopPolling = jest.fn();
  const { result } = renderHook(() =>
    usePollMonitor(startPolling, stopPolling)
  );
  expect(startPolling).toHaveBeenCalledTimes(0);
  expect(stopPolling).toHaveBeenCalledTimes(0);
  expect(result.current).toStrictEqual(false);
});

test("usePollMonitor should return offline when the users browser is offline and polling to have been stopped", () => {
  const startPolling = jest.fn();
  const stopPolling = jest.fn();

  const { result } = renderHook(() =>
    usePollMonitor(startPolling, stopPolling)
  );
  act(() => {
    fireEvent(window, new Event("offline"));
  });
  expect(startPolling).toHaveBeenCalledTimes(0);
  expect(stopPolling).toHaveBeenCalledTimes(1);
  expect(result.current).toStrictEqual(true);
});

test("usePollMonitor should restart polling when the browser is back to online", () => {
  const startPolling = jest.fn();
  const stopPolling = jest.fn();

  const { result } = renderHook(() =>
    usePollMonitor(startPolling, stopPolling)
  );
  act(() => {
    fireEvent(window, new Event("offline"));
  });
  expect(startPolling).toHaveBeenCalledTimes(0);
  expect(stopPolling).toHaveBeenCalledTimes(1);
  expect(result.current).toStrictEqual(true);
  act(() => {
    fireEvent(window, new Event("online"));
  });
  expect(startPolling).toHaveBeenCalledTimes(1);
  expect(stopPolling).toHaveBeenCalledTimes(1);
  expect(result.current).toStrictEqual(false);
});
