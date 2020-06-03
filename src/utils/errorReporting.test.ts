import { reportError } from "utils/errorReporting";
import Bugsnag from "@bugsnag/js";

const err = new Error("test error");
describe("error reporting", () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.resetModules(); // this is important - it clears the cache
    process.env = { ...OLD_ENV };
    delete process.env.NODE_ENV;
  });

  afterEach(() => {
    process.env = OLD_ENV;
  });

  test("Returns a map of empty functions when environment is not Production", async () => {
    // spy on Bugsnag.notify becuase that is called when the functions are not empty
    const notifySpy = jest.spyOn(Bugsnag, "notify");
    const result = reportError(err);
    result.severe();
    result.warning();
    expect(notifySpy).toHaveBeenCalledTimes(0);
  });

  test("Calls returned functions call Bugsnag.notify when environment is Production", () => {
    process.env.NODE_ENV = "production";
    const notifySpy = jest.spyOn(Bugsnag, "notify");
    const result = reportError(err);
    result.severe();
    expect(notifySpy).toHaveBeenCalledTimes(1);
    result.warning();
    expect(notifySpy).toHaveBeenCalledTimes(2);
  });
});
