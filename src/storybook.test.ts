import initStoryshots from "@storybook/addon-storyshots";
import { v4 as uuid } from "uuid";

jest.mock("uuid");
uuid.mockImplementation(() => "SOME_RANDOM_VALUE");
afterAll(() => {
  jest.restoreAllMocks();
});

initStoryshots();
