import initStoryshots from "@storybook/addon-storyshots";
import { render } from "@testing-library/react";
import MatchMediaMock from "jest-matchmedia-mock";

let matchMedia;
describe("storybook", () => {
  jest.setTimeout(20000);

  beforeAll(() => {
    matchMedia = new MatchMediaMock();
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
        disconnect: jest.fn(),
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
    renderer: render,
    asyncJest: true,
    test: ({ context, done, stories2snapsConverter, story }) => {
      const snapshotFileName =
        stories2snapsConverter.getSnapshotFileName(context);

      // eslint-disable-next-line testing-library/render-result-naming-convention
      const jsx = story.render();
      const { container, unmount } = render(jsx);

      // Mount components asynchronously to allow for initial state to be set.
      // Some components have a loading state that is set on mount we should wait for it to finish
      // before taking a snapshot.
      const waitTime = 1;
      setTimeout(() => {
        if (snapshotFileName) {
          expect(container).toMatchSpecificSnapshot(snapshotFileName);
        }
      }, waitTime);
      unmount();
      done?.();
    },
  });
});
