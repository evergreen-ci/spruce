import initStoryshots, {
  snapshotWithOptions,
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
  beforeEach(() => {
    const mockIntersectionObserver = jest.fn((callback) => {
      callback([
        {
          isIntersecting: true,
        },
      ]);
      return {
        observe: jest.fn(),
        unobserve: jest.fn(),
      };
    });

    // @ts-expect-error
    window.IntersectionObserver = mockIntersectionObserver;
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
