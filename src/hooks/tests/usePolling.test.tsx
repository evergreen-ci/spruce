import { MockedProvider } from "@apollo/client/testing";
import { renderHook, act } from "@testing-library/react-hooks/dom";
import Cookie from "js-cookie";
import { FASTER_POLL_INTERVAL, DEFAULT_POLL_INTERVAL } from "constants/index";
import { getUserMock } from "gql/mocks/getUser";
import { usePolling } from "hooks";

jest.mock("js-cookie");

const { get } = Cookie;
const mockedGet = get as unknown as jest.Mock<string>;

const Provider = ({ children }) => (
  <MockedProvider mocks={[getUserMock]}>{children}</MockedProvider>
);

describe("usePolling", () => {
  const updateNetworkStatus = (status: string) => {
    act(() => {
      window.dispatchEvent(new window.Event(status));
    });
  };

  const updatePageVisibility = (status: string) => {
    act(() => {
      Object.defineProperty(document, "visibilityState", {
        value: status,
      });
      document.dispatchEvent(new window.Event("visibilitychange"));
    });
  };

  beforeEach(() => {
    Object.defineProperty(document, "visibilityState", {
      value: "visible",
      configurable: true,
    });
    mockedGet.mockImplementation(() => "false");
  });

  it("usePolling should not call the functions when initialized", async () => {
    const startPolling = jest.fn();
    const stopPolling = jest.fn();
    const refetch = jest.fn();
    const { result, waitForNextUpdate } = renderHook(
      () => usePolling({ startPolling, stopPolling, refetch }),
      {
        wrapper: Provider,
      }
    );
    await waitForNextUpdate();
    expect(startPolling).toHaveBeenCalledTimes(0);
    expect(stopPolling).toHaveBeenCalledTimes(0);
    expect(refetch).toHaveBeenCalledTimes(0);
    expect(result.current).toBe(true);
  });

  describe("polling is disabled", () => {
    it("usePolling evaluates to false when polling is disabled", async () => {
      mockedGet.mockImplementation(() => "true");

      const {
        result: disabledResult,
        waitForNextUpdate: disabledWaitForNextUpdate,
      } = renderHook(
        () =>
          usePolling({
            shouldPollFaster: false,
            startPolling: undefined,
            stopPolling: undefined,
          }),
        {
          wrapper: Provider,
        }
      );
      await disabledWaitForNextUpdate();
      expect(disabledResult.current).toBe(false);

      const {
        result: enabledResult,
        waitForNextUpdate: enabledWaitForNextUpdate,
      } = renderHook(
        () =>
          usePolling({
            shouldPollFaster: true,
            startPolling: undefined,
            stopPolling: undefined,
          }),
        {
          wrapper: Provider,
        }
      );
      await enabledWaitForNextUpdate();
      expect(enabledResult.current).toBe(false);
    });

    it("usePolling should not call the functions when polling is disabled", async () => {
      const startPolling = jest.fn();
      const stopPolling = jest.fn();
      mockedGet.mockImplementation(() => "true");
      let shouldPollFaster = true;
      const { waitForNextUpdate, rerender } = renderHook(
        () =>
          usePolling({
            startPolling,
            stopPolling,
            shouldPollFaster,
          }),
        { wrapper: Provider }
      );
      await waitForNextUpdate();

      // go offline
      updateNetworkStatus("offline");
      shouldPollFaster = false;
      rerender();
      // go online
      updateNetworkStatus("online");
      // document hidden
      updatePageVisibility("hidden");
      shouldPollFaster = true;
      rerender();
      // document visible
      updatePageVisibility("visible");
      expect(startPolling).toHaveBeenCalledTimes(0);
      expect(stopPolling).toHaveBeenCalledTimes(0);
    });
  });

  describe("stopPolling", () => {
    it("usePolling should stop polling when user's browser is offline", async () => {
      const startPolling = jest.fn();
      const stopPolling = jest.fn();

      const { result, waitForNextUpdate } = renderHook(
        () => usePolling({ startPolling, stopPolling }),
        { wrapper: Provider }
      );
      await waitForNextUpdate();
      expect(result.current).toBe(true);

      updateNetworkStatus("offline");
      expect(startPolling).toHaveBeenCalledTimes(0);
      expect(stopPolling).toHaveBeenCalledTimes(1);
      expect(result.current).toBe(false);
    });

    it("usePolling should stop polling when user is not viewing document", async () => {
      const startPolling = jest.fn();
      const stopPolling = jest.fn();

      const { result, waitForNextUpdate } = renderHook(
        () => usePolling({ startPolling, stopPolling }),
        { wrapper: Provider }
      );
      await waitForNextUpdate();
      expect(result.current).toBe(true);

      updatePageVisibility("hidden");
      expect(startPolling).toHaveBeenCalledTimes(0);
      expect(stopPolling).toHaveBeenCalledTimes(1);
      expect(result.current).toBe(false);
    });

    it("usePolling should only call stopPolling once if first user goes offline, then stops viewing document", async () => {
      const startPolling = jest.fn();
      const stopPolling = jest.fn();

      const { result, waitForNextUpdate } = renderHook(
        () => usePolling({ startPolling, stopPolling }),
        { wrapper: Provider }
      );
      await waitForNextUpdate();
      expect(result.current).toBe(true);

      // go offline
      updateNetworkStatus("offline");
      expect(startPolling).toHaveBeenCalledTimes(0);
      expect(stopPolling).toHaveBeenCalledTimes(1);
      expect(result.current).toBe(false);

      // document hidden
      updatePageVisibility("hidden");
      expect(startPolling).toHaveBeenCalledTimes(0);
      expect(stopPolling).toHaveBeenCalledTimes(1);
      expect(result.current).toBe(false);
    });

    it("usePolling should only call stopPolling once if first user stops viewing document, then goes offline", async () => {
      const startPolling = jest.fn();
      const stopPolling = jest.fn();

      const { result, waitForNextUpdate } = renderHook(
        () => usePolling({ startPolling, stopPolling }),
        { wrapper: Provider }
      );
      await waitForNextUpdate();
      expect(result.current).toBe(true);

      // document hidden
      updatePageVisibility("hidden");
      expect(startPolling).toHaveBeenCalledTimes(0);
      expect(stopPolling).toHaveBeenCalledTimes(1);
      expect(result.current).toBe(false);

      // go offline
      updateNetworkStatus("offline");
      expect(startPolling).toHaveBeenCalledTimes(0);
      expect(stopPolling).toHaveBeenCalledTimes(1);
      expect(result.current).toBe(false);
    });
  });

  describe("startPolling", () => {
    it("usePolling should only restart polling when the browser is online AND document is visible", async () => {
      const startPolling = jest.fn();
      const stopPolling = jest.fn();

      const { result, waitForNextUpdate } = renderHook(
        () => usePolling({ startPolling, stopPolling }),
        { wrapper: Provider }
      );
      await waitForNextUpdate();
      expect(result.current).toBe(true);

      // go offline
      updateNetworkStatus("offline");
      expect(startPolling).toHaveBeenCalledTimes(0);
      expect(stopPolling).toHaveBeenCalledTimes(1);
      expect(result.current).toBe(false);

      // document hidden
      updatePageVisibility("hidden");
      expect(startPolling).toHaveBeenCalledTimes(0);
      expect(stopPolling).toHaveBeenCalledTimes(1);
      expect(result.current).toBe(false);

      // go online - should not start polling because document is still hidden
      updateNetworkStatus("online");
      expect(startPolling).toHaveBeenCalledTimes(0);
      expect(stopPolling).toHaveBeenCalledTimes(1);
      expect(result.current).toBe(false);

      // document visible - start polling
      updatePageVisibility("visible");
      /* eslint-disable jest/max-expects */
      expect(startPolling).toHaveBeenCalledTimes(1);
      expect(stopPolling).toHaveBeenCalledTimes(1);
      expect(result.current).toBe(true);
      /* eslint-enable jest/max-expects */
    });
  });

  describe("shouldPollFaster", () => {
    it("calls startPolling with a fast poll rate when shouldPollFaster is enabled and should use the default poll rate when it is disabled", async () => {
      const startPolling = jest.fn();
      let shouldPollFaster = true;
      const { rerender } = renderHook(
        () =>
          usePolling({
            startPolling,
            stopPolling: undefined,
            shouldPollFaster,
          }),
        { wrapper: Provider }
      );
      expect(startPolling).toHaveBeenCalledTimes(1);
      expect(startPolling).toHaveBeenLastCalledWith(FASTER_POLL_INTERVAL);
      shouldPollFaster = false;
      rerender();
      expect(startPolling).toHaveBeenCalledTimes(2);
      expect(startPolling).toHaveBeenLastCalledWith(DEFAULT_POLL_INTERVAL);
    });
  });

  describe("refetch", () => {
    it("usePolling calls refetch function when starting to poll again", async () => {
      const startPolling = jest.fn();
      const stopPolling = jest.fn();
      const refetch = jest.fn();

      const { waitForNextUpdate } = renderHook(
        () => usePolling({ startPolling, stopPolling, refetch }),
        { wrapper: Provider }
      );
      await waitForNextUpdate();

      // go offline
      updateNetworkStatus("offline");
      expect(refetch).toHaveBeenCalledTimes(0);
      expect(startPolling).toHaveBeenCalledTimes(0);
      expect(stopPolling).toHaveBeenCalledTimes(1);

      // go online
      updateNetworkStatus("online");
      expect(refetch).toHaveBeenCalledTimes(1);
      expect(startPolling).toHaveBeenCalledTimes(1);
      expect(stopPolling).toHaveBeenCalledTimes(1);

      // document hidden
      updatePageVisibility("hidden");
      expect(refetch).toHaveBeenCalledTimes(1);
      expect(startPolling).toHaveBeenCalledTimes(1);
      expect(stopPolling).toHaveBeenCalledTimes(2);

      // document visible
      updatePageVisibility("visible");
      expect(refetch).toHaveBeenCalledTimes(2);
      /* eslint-disable jest/max-expects */
      expect(startPolling).toHaveBeenCalledTimes(2);
      expect(stopPolling).toHaveBeenCalledTimes(2);
      /* eslint-enable jest/max-expects */
    });
  });
});
