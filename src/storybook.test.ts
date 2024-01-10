/* eslint-disable jest/require-hook */
import { composeStories } from "@storybook/react";
import * as glob from "glob";
import "jest-specific-snapshot";
import MatchMediaMock from "jest-matchmedia-mock";
import path from "path";
import { act, render } from "test_utils";
import { CustomMeta, CustomStoryObj } from "test_utils/types";
import * as projectAnnotations from "../.storybook/preview";

let matchMedia;

type StoryFile = {
  default: CustomMeta<unknown>;
  [name: string]: CustomStoryObj<unknown> | CustomMeta<unknown>;
};

/**
 * `compose` takes a story file and returns a composed story file with the annotations from the storybook preview file.
 * @param entry - The story file to compose
 * @returns - A composed story file
 */
const compose = (
  entry: StoryFile
): ReturnType<typeof composeStories<StoryFile>> => {
  try {
    return composeStories(entry, projectAnnotations);
  } catch (e) {
    throw new Error(
      `There was an issue composing stories for the module: ${JSON.stringify(
        entry
      )}, ${e}`
    );
  }
};

const getAllStoryFiles = () => {
  const storyFiles = glob.sync(path.join(__dirname, "**/*.stories.tsx"));
  return storyFiles.map((filePath) => {
    // eslint-disable-next-line import/no-dynamic-require, global-require
    const storyFile: StoryFile = require(filePath);
    return { filePath, storyFile };
  });
};

const options = {
  suite: "Snapshot Tests",
  storyKindRegex: /^.*?DontTest$/,
  storyNameRegex: /UNSET/,
  snapshotsDirName: "__snapshots__",
  snapshotExtension: ".storyshot",
};

describe(`${options.suite}`, () => {
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
  getAllStoryFiles().forEach((params) => {
    const { filePath, storyFile } = params;
    const meta = storyFile.default;
    const { title } = meta;

    const storyBookFileBaseName = path
      .basename(filePath)
      .replace(/\.[^/.]+$/, "");
    // storyName is either the title of the story or the name of the file without the extension
    const storyName = title || storyBookFileBaseName;
    if (
      options.storyKindRegex.test(title) ||
      meta.parameters?.storyshots?.disable
    ) {
      // Skip component tests if they are disabled
      return;
    }

    describe(`${storyName}`, () => {
      const stories = Object.entries(compose(storyFile))
        .map(([name, story]) => ({ name, story }))
        .filter(
          ({ name, story }) =>
            // Implements a filtering mechanism to avoid running stories that are disabled via parameters or that match a specific regex mirroring the default behavior of Storyshots.
            !options.storyNameRegex.test(name) &&
            !story.parameters.storyshots?.disable
        );

      if (stories.length <= 0) {
        throw new Error(
          `No stories found for this module: ${title}. Make sure there is at least one valid story for this module, without a disable parameter, or add parameters.storyshots.disable in the default export of this file.`
        );
      }

      stories.forEach(({ name, story }) => {
        it(`${name}`, async () => {
          const { container } = render(story());
          await act(async () => {
            await new Promise((resolve) => {
              setTimeout(resolve, 0);
            });
          });
          const storyDirectory = path.dirname(filePath);
          const snapshotPath = path.join(
            storyDirectory,
            options.snapshotsDirName,
            `${storyBookFileBaseName}${options.snapshotExtension}`
          );
          expect(container).toMatchSpecificSnapshot(snapshotPath);
        });
      });
    });
  });
});
