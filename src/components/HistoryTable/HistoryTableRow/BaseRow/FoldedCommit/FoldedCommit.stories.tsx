import { MockedProvider } from "@apollo/client/testing";
import { StoryObj } from "@storybook/react";
import { getSpruceConfigMock } from "gql/mocks/getSpruceConfig";
import FoldedCommit from ".";
import { foldedCommitData } from "./testData";

export default {
  component: FoldedCommit,
  title: "components/HistoryTable/FoldedCommit",
};

export const FoldedCommitStory: StoryObj<typeof FoldedCommit> = {
  render: (args) => <FoldedCommit {...args} />,
  args: {
    index: 0,
    data: foldedCommitData,
    numVisibleCols: 5,
    selected: false,
  },
  decorators: [
    (Story: () => JSX.Element) => (
      <MockedProvider mocks={[getSpruceConfigMock]}>
        <Story />
      </MockedProvider>
    ),
  ],
};
