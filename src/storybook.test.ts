import initStoryshots, {
  snapshotWithOptions,
} from "@storybook/addon-storyshots";
import MatchMediaMock from "jest-matchmedia-mock";
import { mockUUID } from "test_utils";

// Recent updates to LG components cause a breaking change for storyshots because of the introduction of
// createUniqueClassName, a function that generates unique classnames at run time. We need to mock out the
// function so that our snapshots don't break. (https://jira.mongodb.org/browse/PD-2179)
jest.mock("@leafygreen-ui/lib", () => ({
  ...jest.requireActual("@leafygreen-ui/lib"),
  createUniqueClassName: jest.fn().mockReturnValue("static-lg-ui-classname"),
}));

// Must mock uuid for this test since getRandomValues() is not supported in CI
jest.mock("uuid");

let matchMedia;
describe("storybook", () => {
  beforeAll(() => {
    matchMedia = new MatchMediaMock();
    mockUUID();
  });

  afterAll(() => {
    matchMedia.clear();
    jest.restoreAllMocks();
  });
  // eslint-disable-next-line jest/require-hook
  initStoryshots({
    test: ({ story, context, renderTree, stories2snapsConverter }) => {
      const snapshotFileName =
        stories2snapsConverter.getSnapshotFileName(context);
      return snapshotWithOptions({})({
        story,
        context,
        renderTree,
        snapshotFileName: snapshotFileName.replace("src", "."),
      });
    },
  });
});
