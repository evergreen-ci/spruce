import { MockedProvider } from "@apollo/client/testing";
import { fireEvent } from "@testing-library/react";
import { renderHook, act } from "@testing-library/react-hooks";
import Cookie from "js-cookie";
import { GET_USER } from "gql/queries";
import { usePolling } from "hooks";

jest.mock("js-cookie");

const { get } = Cookie;
const mockedGet = (get as unknown) as jest.Mock<string>;

const Provider = ({ children }) => (
  <MockedProvider mocks={[getUserMock]}>{children}</MockedProvider>
);

describe("usePolling", () => {
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
      () => usePolling(startPolling, stopPolling, refetch),
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

      const { result, waitForNextUpdate } = renderHook(
        () => usePolling(undefined, undefined, undefined, false),
        { wrapper: Provider }
      );
      await waitForNextUpdate();
      expect(result.current).toBe(false);
      const pollingInitialized = renderHook(
        () => usePolling(undefined, undefined, undefined, true),
        {
          wrapper: Provider,
        }
      );
      await pollingInitialized.waitForNextUpdate();
      expect(pollingInitialized.result.current).toBe(false);
    });

    it("usePolling should not call the functions when polling is disabled", async () => {
      const startPolling = jest.fn();
      const stopPolling = jest.fn();
      mockedGet.mockImplementation(() => "true");

      const { waitForNextUpdate } = renderHook(
        () => usePolling(startPolling, stopPolling, undefined),
        { wrapper: Provider }
      );
      await waitForNextUpdate();
      // go offline
      act(() => {
        fireEvent(window, new Event("offline"));
      });
      // go online
      act(() => {
        fireEvent(window, new Event("online"));
      });
      // document hidden
      act(() => {
        Object.defineProperty(document, "visibilityState", {
          value: "hidden",
        });
        fireEvent(document, new Event("visibilitychange"));
      });
      // document visible
      act(() => {
        Object.defineProperty(document, "visibilityState", {
          value: "visible",
        });
        fireEvent(document, new Event("visibilitychange"));
      });
      expect(startPolling).toHaveBeenCalledTimes(0);
      expect(stopPolling).toHaveBeenCalledTimes(0);
    });
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

  describe("refetch", () => {
    it("usePolling calls refetch function when starting to poll again", async () => {
      const startPolling = jest.fn();
      const stopPolling = jest.fn();
      const refetch = jest.fn();

      const { waitForNextUpdate } = renderHook(
        () => usePolling(startPolling, stopPolling, refetch),
        { wrapper: Provider }
      );
      await waitForNextUpdate();

      // go offline
      act(() => {
        fireEvent(window, new Event("offline"));
      });
      expect(refetch).toHaveBeenCalledTimes(0);
      expect(startPolling).toHaveBeenCalledTimes(0);
      expect(stopPolling).toHaveBeenCalledTimes(1);

      // go online
      act(() => {
        fireEvent(window, new Event("online"));
      });
      expect(refetch).toHaveBeenCalledTimes(1);
      expect(startPolling).toHaveBeenCalledTimes(1);
      expect(stopPolling).toHaveBeenCalledTimes(1);

      // document hidden
      act(() => {
        Object.defineProperty(document, "visibilityState", {
          value: "hidden",
        });
        fireEvent(document, new Event("visibilitychange"));
      });
      expect(refetch).toHaveBeenCalledTimes(1);
      expect(startPolling).toHaveBeenCalledTimes(1);
      expect(stopPolling).toHaveBeenCalledTimes(2);

      // document visible
      act(() => {
        Object.defineProperty(document, "visibilityState", {
          value: "visible",
        });
        fireEvent(document, new Event("visibilitychange"));
      });
      expect(refetch).toHaveBeenCalledTimes(2);
      expect(startPolling).toHaveBeenCalledTimes(2);
      expect(stopPolling).toHaveBeenCalledTimes(2);
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
