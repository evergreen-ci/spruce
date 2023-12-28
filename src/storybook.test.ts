import MatchMediaMock from "jest-matchmedia-mock";

let matchMedia;
describe.skip("storybook", () => {
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
});
