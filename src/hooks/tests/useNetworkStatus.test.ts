import { fireEvent } from "@testing-library/react";
import { renderHook, act } from "@testing-library/react-hooks";
import { useNetworkStatus } from "hooks";

test("useNetworkStatus should return online when the users browser is online and polling to not have been interrupted", () => {
  const startPolling = jest.fn();
  const stopPolling = jest.fn();
  const { result } = renderHook(() =>
    useNetworkStatus(startPolling, stopPolling)
  );
  expect(startPolling).toHaveBeenCalledTimes(0);
  expect(stopPolling).toHaveBeenCalledTimes(0);
  expect(result.current).toBe(false);
});

test("useNetworkStatus should return offline when the users browser is offline and polling to have been stopped", () => {
  const startPolling = jest.fn();
  const stopPolling = jest.fn();

  const { result } = renderHook(() =>
    useNetworkStatus(startPolling, stopPolling)
  );
  act(() => {
    fireEvent(window, new Event("offline"));
  });
  expect(startPolling).toHaveBeenCalledTimes(0);
  expect(stopPolling).toHaveBeenCalledTimes(1);
  expect(result.current).toBe(true);
});

test("useNetworkStatus should restart polling when the browser is back to online", () => {
  const startPolling = jest.fn();
  const stopPolling = jest.fn();

  const { result } = renderHook(() =>
    useNetworkStatus(startPolling, stopPolling)
  );
  act(() => {
    fireEvent(window, new Event("offline"));
  });
  expect(startPolling).toHaveBeenCalledTimes(0);
  expect(stopPolling).toHaveBeenCalledTimes(1);
  expect(result.current).toBe(true);
  act(() => {
    fireEvent(window, new Event("online"));
  });
  expect(startPolling).toHaveBeenCalledTimes(1);
  expect(stopPolling).toHaveBeenCalledTimes(1);
  expect(result.current).toBe(false);
});
