import Bugsnag from "@bugsnag/js";
import { reportError } from "utils/errorReporting";

const err = new Error("test error");

describe("Error reporting", () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.resetModules(); // this is important - it clears the cache
    process.env = { ...OLD_ENV };
    // @ts-ignore
    delete process.env.NODE_ENV;
  });

  afterEach(() => {
    process.env = OLD_ENV;
  });

  test("Returns a map of empty functions when environment is not Production", async () => {
    // spy on Bugsnag.notify and newrelic.noticeError becuase that is called when the functions are not empty
    const notifySpy = jest.spyOn(Bugsnag, "notify");
    const result = reportError(err);
    result.severe();
    result.warning();
    expect(notifySpy).toHaveBeenCalledTimes(0);
  });

  test("Returns a map of functions that call Bugsnag.notify and newrelic.noticeError with an error object when environment is Production", () => {
    // @ts-ignore
    process.env.NODE_ENV = "production";
    const notifySpy = jest.spyOn(Bugsnag, "notify");
    const result = reportError(err);
    result.severe();
    expect(notifySpy).toHaveBeenCalledTimes(1);
    expect(notifySpy.mock.calls[0][0]).toBe(err);
    result.warning();
    expect(notifySpy).toHaveBeenCalledTimes(2);
    expect(notifySpy.mock.calls[1][0]).toBe(err);
  });
});
