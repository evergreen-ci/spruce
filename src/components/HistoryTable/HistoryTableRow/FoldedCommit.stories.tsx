import { CSSProperties, useState } from "react";
import { withKnobs } from "@storybook/addon-knobs";
import StoryRouter from "storybook-react-router";
import { FOLDED_COMMITS_HEIGHT, COMMIT_HEIGHT } from "../constants";
import { FoldedCommit } from "./FoldedCommit";

export default {
  title: "Folded Commit",
  decorators: [StoryRouter(), withKnobs],
  component: FoldedCommit,
};

export const FoldedInactiveCommits = () => {
  const [style, setStyle] = useState(collapsedStyle);

  // This function is meant to simulate the style-change behavior that is automatically handled
  // by the AutoSizer. The params are ignored because they're only needed in the context of the
  // History Table.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const toggleRow = (idx: number, numCommits: number) => {
    if (style.height === FOLDED_COMMITS_HEIGHT) {
      setStyle(expandedStyle);
    } else {
      setStyle(collapsedStyle);
    }
  };

  return (
    <FoldedCommit
      index={0}
      rolledUpCommits={rolledUpCommits}
      toggleRow={toggleRow}
      numVisibleCols={5}
      style={style}
    />
  );
};

const rolledUpCommits = [
  {
    id: "1",
    createTime: new Date("2021-09-22T19:33:22Z"),
    author: "A developer",
    order: 1010,
    message: "v2.17.0",
    revision: "ca3a8b45e855cf0d2e353a85c8af2d4c2a1dad95",
  },
  {
    id: "2",
    createTime: new Date("2021-09-23T19:33:22Z"),
    author: "A developer",
    order: 1020,
    message: "v2.17.1",
    revision: "ca3a8b45e855cf0d2e353a85c8af2d4c2a1dad95",
  },
  {
    id: "3",
    createTime: new Date("2021-09-24T19:33:22Z"),
    author: "A developer",
    order: 1030,
    message: "v2.17.2",
    revision: "ca3a8b45e855cf0d2e353a85c8af2d4c2a1dad95",
  },
  {
    id: "4",
    createTime: new Date("2021-09-25T19:33:22Z"),
    author: "A developer",
    order: 1040,
    message: "v2.17.3",
    revision: "ca3a8b45e855cf0d2e353a85c8af2d4c2a1dad95",
  },
  {
    id: "5",
    createTime: new Date("2021-09-26T19:33:22Z"),
    author: "A developer",
    order: 1050,
    message: "v2.17.4",
    revision: "ca3a8b45e855cf0d2e353a85c8af2d4c2a1dad95",
  },
];

const collapsedStyle: CSSProperties = {
  top: 20, // offsetting for storybook
  left: 20, // offsetting for storybook
  position: "absolute",
  height: FOLDED_COMMITS_HEIGHT,
};

const expandedStyle: CSSProperties = {
  top: 20, // offsetting for storybook
  left: 20, // offsetting for storybook
  position: "absolute",
  height: FOLDED_COMMITS_HEIGHT + rolledUpCommits.length * COMMIT_HEIGHT,
};
