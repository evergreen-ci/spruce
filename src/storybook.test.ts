import initStoryshots, {
  multiSnapshotWithOptions,
} from "@storybook/addon-storyshots";
import MatchMediaMock from "jest-matchmedia-mock";
import { mockUUID } from "test_utils";

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
  initStoryshots({ test: multiSnapshotWithOptions() });
});
