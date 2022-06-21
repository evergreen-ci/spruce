import Bugsnag from "@bugsnag/js";
import BugsnagPluginReact from "@bugsnag/plugin-react";
import { render } from "test_utils";
import { mockEnvironmentalVariables } from "test_utils/utils";
import * as environmentalVariables from "utils/environmentalVariables";
import { resetBugsnag, initializeBugsnag, ErrorBoundary } from ".";

const { cleanup, mockEnv } = mockEnvironmentalVariables();
describe("initializeBugsnag", () => {
  afterEach(() => {
    jest.restoreAllMocks();
    resetBugsnag();
    cleanup();
  });
  it("should not initialize bugsnag if on development environment", () => {
    const mockBugsnag = jest.fn();
    jest.spyOn(Bugsnag, "start").mockImplementation(mockBugsnag);
    jest
      .spyOn(environmentalVariables, "isDevelopmentBuild")
      .mockReturnValue(true);
    mockEnv("REACT_APP_VERSION", "1.0.0");
    initializeBugsnag();
    expect(Bugsnag.start).not.toHaveBeenCalled();
  });

  it("should initialize bugsnag if running in production", () => {
    const mockBugsnag = jest.fn();
    jest.spyOn(Bugsnag, "start").mockImplementation(mockBugsnag);

    mockEnv("NODE_ENV", "production");
    mockEnv("REACT_APP_VERSION", "1.0.0");
    mockEnv("REACT_APP_RELEASE_STAGE", "production");

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
      cleanup();
    });
    it("beta", () => {
      const mockBugsnag = jest.fn();
      jest.spyOn(Bugsnag, "start").mockImplementation(mockBugsnag);
      mockEnv("REACT_APP_RELEASE_STAGE", "beta");
      mockEnv("NODE_ENV", "production");
      mockEnv("REACT_APP_VERSION", "1.0.0");

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
      mockEnv("NODE_ENV", "production");
      mockEnv("REACT_APP_VERSION", "1.0.0");
      mockEnv("REACT_APP_RELEASE_STAGE", "staging");
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

describe("error boundary", () => {
  beforeEach(() => {
    jest.spyOn(console, "error").mockImplementation(() => {});
    jest.spyOn(Bugsnag, "notify");
  });
  afterEach(() => {
    cleanup();
    jest.restoreAllMocks();
  });
  it("should render the passed in component", () => {
    const TestComponent = () => <div>Hello</div>;
    const TestErrorBoundary = () => (
      <ErrorBoundary>
        <TestComponent />
      </ErrorBoundary>
    );
    const { getByText } = render(<TestErrorBoundary />);
    expect(getByText("Hello")).toBeInTheDocument();
  });
  it("should display the fallback when an error occurs", () => {
    const err = new Error("Test error");

    const TestComponent = () => {
      throw err;
    };
    const TestErrorBoundary = () => (
      <ErrorBoundary>
        <TestComponent />
      </ErrorBoundary>
    );
    const { getByText } = render(<TestErrorBoundary />);
    expect(getByText("Error")).toBeInTheDocument();
    expect(console.error).toHaveBeenCalledWith({
      error: err,
      errorInfo: expect.objectContaining({
        componentStack: expect.any(String),
      }),
    });
    expect(Bugsnag.notify).not.toHaveBeenCalled();
  });
});
