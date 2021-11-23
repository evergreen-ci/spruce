import initStoryshots, {
  multiSnapshotWithOptions,
} from "@storybook/addon-storyshots";
import MatchMediaMock from "jest-matchmedia-mock";
import { v4 as uuid } from "uuid";

jest.mock("uuid");
uuid.mockImplementation(() => "SOME_RANDOM_VALUE");
let matchMedia;

beforeAll(() => {
  matchMedia = new MatchMediaMock();
});

afterEach(() => {
  matchMedia.clear();
  jest.restoreAllMocks();
});
initStoryshots({ test: multiSnapshotWithOptions() });
