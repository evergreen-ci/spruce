import { MockedProvider } from "@apollo/client/testing";
import { fireEvent } from "@testing-library/react";
import { renderHook, act } from "@testing-library/react-hooks";
import { GET_USER } from "gql/queries";
import { usePolling } from "hooks";

const Provider = ({ children }) => (
  <MockedProvider mocks={[getUserMock]}>{children}</MockedProvider>
);

describe("usePolling", () => {
  beforeEach(() => {
    Object.defineProperty(document, "visibilityState", {
      value: "visible",
      configurable: true,
    });
  });

  it("usePolling should not call the functions when initialized", async () => {
    const startPolling = jest.fn();
    const stopPolling = jest.fn();
    const { result, waitForNextUpdate } = renderHook(
      () => usePolling(startPolling, stopPolling),
      {
        wrapper: Provider,
      }
    );
    await waitForNextUpdate();
    expect(startPolling).toHaveBeenCalledTimes(0);
    expect(stopPolling).toHaveBeenCalledTimes(0);
    expect(result.current).toBe(true);
  });

  it("usePolling should be able to be initialized with an initialPollingState", async () => {
    const startPolling = undefined;
    const stopPolling = undefined;
    const { result, waitForNextUpdate } = renderHook(
      () => usePolling(startPolling, stopPolling, false),
      {
        wrapper: Provider,
      }
    );
    await waitForNextUpdate();
    expect(result.current).toBe(false);
  });

  describe("stopPolling", () => {
    it("usePolling should stop polling when user's browser is offline", async () => {
      const startPolling = jest.fn();
      const stopPolling = jest.fn();

      const { result, waitForNextUpdate } = renderHook(
        () => usePolling(startPolling, stopPolling),
        { wrapper: Provider }
      );
      await waitForNextUpdate();
      expect(result.current).toBe(true);

      act(() => {
        fireEvent(window, new Event("offline"));
      });
      expect(startPolling).toHaveBeenCalledTimes(0);
      expect(stopPolling).toHaveBeenCalledTimes(1);
      expect(result.current).toBe(false);
    });

    it("usePolling should stop polling when user is not viewing document", async () => {
      const startPolling = jest.fn();
      const stopPolling = jest.fn();

      const { result, waitForNextUpdate } = renderHook(
        () => usePolling(startPolling, stopPolling),
        { wrapper: Provider }
      );
      await waitForNextUpdate();
      expect(result.current).toBe(true);

      act(() => {
        Object.defineProperty(document, "visibilityState", {
          value: "hidden",
        });
        fireEvent(document, new Event("visibilitychange"));
      });
      expect(startPolling).toHaveBeenCalledTimes(0);
      expect(stopPolling).toHaveBeenCalledTimes(1);
      expect(result.current).toBe(false);
    });

    it("usePolling should only call stopPolling once if first user goes offline, then stops viewing document", async () => {
      const startPolling = jest.fn();
      const stopPolling = jest.fn();

      const { result, waitForNextUpdate } = renderHook(
        () => usePolling(startPolling, stopPolling),
        { wrapper: Provider }
      );
      await waitForNextUpdate();
      expect(result.current).toBe(true);

      // go offline
      act(() => {
        fireEvent(window, new Event("offline"));
      });
      expect(startPolling).toHaveBeenCalledTimes(0);
      expect(stopPolling).toHaveBeenCalledTimes(1);
      expect(result.current).toBe(false);

      // document hidden
      act(() => {
        Object.defineProperty(document, "visibilityState", {
          value: "hidden",
        });
        fireEvent(document, new Event("visibilitychange"));
      });
      expect(startPolling).toHaveBeenCalledTimes(0);
      expect(stopPolling).toHaveBeenCalledTimes(1);
      expect(result.current).toBe(false);
    });

    it("usePolling should only call stopPolling once if first user stops viewing document, then goes offline", async () => {
      const startPolling = jest.fn();
      const stopPolling = jest.fn();

      const { result, waitForNextUpdate } = renderHook(
        () => usePolling(startPolling, stopPolling),
        { wrapper: Provider }
      );
      await waitForNextUpdate();
      expect(result.current).toBe(true);

      // document hidden
      act(() => {
        Object.defineProperty(document, "visibilityState", {
          value: "hidden",
        });
        fireEvent(document, new Event("visibilitychange"));
      });
      expect(startPolling).toHaveBeenCalledTimes(0);
      expect(stopPolling).toHaveBeenCalledTimes(1);
      expect(result.current).toBe(false);

      // go offline
      act(() => {
        fireEvent(window, new Event("offline"));
      });
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
        () => usePolling(startPolling, stopPolling),
        { wrapper: Provider }
      );
      await waitForNextUpdate();
      expect(result.current).toBe(true);

      // go offline
      act(() => {
        fireEvent(window, new Event("offline"));
      });
      expect(startPolling).toHaveBeenCalledTimes(0);
      expect(stopPolling).toHaveBeenCalledTimes(1);
      expect(result.current).toBe(false);

      // document hidden
      act(() => {
        Object.defineProperty(document, "visibilityState", {
          value: "hidden",
        });
        fireEvent(document, new Event("visibilitychange"));
      });
      expect(startPolling).toHaveBeenCalledTimes(0);
      expect(stopPolling).toHaveBeenCalledTimes(1);
      expect(result.current).toBe(false);

      // go online - should not start polling because document is still hidden
      act(() => {
        fireEvent(window, new Event("online"));
      });
      expect(startPolling).toHaveBeenCalledTimes(0);
      expect(stopPolling).toHaveBeenCalledTimes(1);
      expect(result.current).toBe(false);

      // document visible - start polling
      act(() => {
        Object.defineProperty(document, "visibilityState", {
          value: "visible",
        });
        fireEvent(document, new Event("visibilitychange"));
      });
      expect(startPolling).toHaveBeenCalledTimes(1);
      expect(stopPolling).toHaveBeenCalledTimes(1);
      expect(result.current).toBe(true);
    });
  });
});

const getUserMock = {
  request: {
    query: GET_USER,
  },
  result: {
    data: {
      user: {
        userId: "",
        displayName: "",
        emailAddress: "fake.user@mongodb.com",
        __typename: "User",
      },
    },
  },
};
