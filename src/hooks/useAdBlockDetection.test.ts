import { renderHook } from "@testing-library/react-hooks";
import axios from "axios";
import { RenderFakeToastContext } from "context/__mocks__/toast";
import * as errorReporting from "utils/errorReporting";
import { useAdBlockDetection } from "./useAdBlockDetection";

const OLD_ENV = process.env;

beforeEach(() => {
  jest.restoreAllMocks();
  jest.resetModules(); // Most important - it clears the cache
  process.env = { ...OLD_ENV }; // Make a copy
});

afterEach(() => {
  process.env = OLD_ENV; // Restore old environment
});

test("Should not run if not on development environment", () => {
  jest
    .spyOn(axios, "get")
    .mockImplementation(() => Promise.resolve({ statusText: "OK" }));
  const { HookWrapper, dispatchToast } = RenderFakeToastContext();
  // @ts-ignore This is considered bad practice we should not be overriding NODE_ENV but its the only way to test this
  process.env.NODE_ENV = "development";
  // render hook
  renderHook(() => useAdBlockDetection(), { wrapper: HookWrapper });
  expect(dispatchToast.info).not.toHaveBeenCalled();
});
test("Should not prompt the user if their browser does not block the request", async () => {
  jest
    .spyOn(axios, "get")
    .mockImplementation(() => Promise.resolve({ statusText: "OK" }));
  const { HookWrapper, dispatchToast } = RenderFakeToastContext();
  // @ts-ignore This is considered bad practice we should not be overriding NODE_ENV but its the only way to test this
  process.env.NODE_ENV = "production";
  // render hook
  renderHook(() => useAdBlockDetection(), {
    wrapper: HookWrapper,
  });
  expect(dispatchToast.info).not.toHaveBeenCalled();
});
test("Should trigger a toast if the user browser blocks the toast", async () => {
  jest
    .spyOn(axios, "get")
    .mockImplementation(() => Promise.resolve({ statusText: "ERROR" }));

  // Mock out the error reporting being thrown
  // this only happens in this test because we are mocking production
  jest.spyOn(errorReporting, "reportError").mockImplementation(() => ({
    warning: () => {},
    severe: () => {},
  }));
  const { HookWrapper, dispatchToast } = RenderFakeToastContext();
  // @ts-ignore This is considered bad practice we should not be overriding NODE_ENV but its the only way to test this
  process.env.NODE_ENV = "production";
  // render hook
  const { waitFor } = renderHook(() => useAdBlockDetection(), {
    wrapper: HookWrapper,
  });
  await waitFor(() => {
    expect(dispatchToast.info).toHaveBeenCalled();
  });
});
