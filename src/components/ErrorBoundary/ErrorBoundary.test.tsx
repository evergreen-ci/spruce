import Bugsnag from "@bugsnag/js";
import BugsnagPluginReact from "@bugsnag/plugin-react";
import * as environmentalVariables from "utils/environmentalVariables";
import { resetBugsnag, initializeBugsnag } from ".";

const restoreCalls = [];
const mockEnvironmentalVariable = (variable: string, value: string) => {
  const before = process.env[variable];
  process.env[variable] = value;

  const restore = () => {
    process.env[variable] = before;
  };
  restoreCalls.push(restore);
  return { restore };
};

describe("initializeBugsnag", () => {
  afterEach(() => {
    jest.restoreAllMocks();
    resetBugsnag();
    restoreCalls.forEach((restore) => restore());
  });
  it("should not initialize bugsnag if on development environment", () => {
    const mockBugsnag = jest.fn();
    jest.spyOn(Bugsnag, "start").mockImplementation(mockBugsnag);
    jest.spyOn(environmentalVariables, "isDevelopment").mockReturnValue(true);
    mockEnvironmentalVariable("REACT_APP_VERSION", "1.0.0");
    initializeBugsnag();
    expect(Bugsnag.start).not.toHaveBeenCalled();
  });

  it("should initialize bugsnag if running in production", () => {
    const mockBugsnag = jest.fn();
    jest.spyOn(Bugsnag, "start").mockImplementation(mockBugsnag);

    mockEnvironmentalVariable("NODE_ENV", "production");
    mockEnvironmentalVariable("REACT_APP_VERSION", "1.0.0");
    mockEnvironmentalVariable("REACT_APP_RELEASE_STAGE", "production");

    initializeBugsnag();
    expect(Bugsnag.start).toHaveBeenCalledWith({
      apiKey: "i-am-a-fake-key",
      appVersion: "1.0.0",
      releaseStage: "production",
      plugins: [new BugsnagPluginReact()],
    });
  });
  describe("should initialize bugsnag with appropriate release stage", () => {
    afterEach(() => {
      jest.restoreAllMocks();
      resetBugsnag();
      restoreCalls.forEach((restore) => restore());
    });
    it("beta", () => {
      const mockBugsnag = jest.fn();
      jest.spyOn(Bugsnag, "start").mockImplementation(mockBugsnag);
      mockEnvironmentalVariable("REACT_APP_RELEASE_STAGE", "beta");
      mockEnvironmentalVariable("NODE_ENV", "production");
      mockEnvironmentalVariable("REACT_APP_VERSION", "1.0.0");

      initializeBugsnag();
      expect(mockBugsnag).toHaveBeenCalledWith({
        apiKey: "i-am-a-fake-key",
        appVersion: "1.0.0",
        releaseStage: "beta",
        plugins: [new BugsnagPluginReact()],
      });
    });
    it("staging", () => {
      const mockBugsnag = jest.fn();
      jest.spyOn(Bugsnag, "start").mockImplementation(mockBugsnag);
      mockEnvironmentalVariable("NODE_ENV", "production");
      mockEnvironmentalVariable("REACT_APP_VERSION", "1.0.0");
      mockEnvironmentalVariable("REACT_APP_RELEASE_STAGE", "staging");
      initializeBugsnag();
      expect(mockBugsnag).toHaveBeenCalledWith({
        apiKey: "i-am-a-fake-key",
        appVersion: "1.0.0",
        releaseStage: "staging",
        plugins: [new BugsnagPluginReact()],
      });
    });
  });
});
