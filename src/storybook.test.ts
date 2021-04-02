import initStoryshots, {
  multiSnapshotWithOptions,
} from "@storybook/addon-storyshots";
import { v4 as uuid } from "uuid";
import "test_utils/__mocks__/matchmedia.mock";

jest.mock("uuid");
uuid.mockImplementation(() => "SOME_RANDOM_VALUE");
afterAll(() => {
  jest.restoreAllMocks();
});

initStoryshots({ test: multiSnapshotWithOptions() });
