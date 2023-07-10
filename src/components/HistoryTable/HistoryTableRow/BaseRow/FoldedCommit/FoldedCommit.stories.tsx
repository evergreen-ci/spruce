import { getSpruceConfigMock } from "gql/mocks/getSpruceConfig";
import { CustomStoryObj, CustomMeta } from "test_utils/types";

import FoldedCommit from ".";
import { foldedCommitData } from "./testData";

export default {
  component: FoldedCommit,
  title: "components/HistoryTable/FoldedCommit",
} satisfies CustomMeta<typeof FoldedCommit>;

export const FoldedCommitStory: CustomStoryObj<typeof FoldedCommit> = {
  render: (args) => <FoldedCommit {...args} />,
  args: {
    index: 0,
    data: foldedCommitData,
    numVisibleCols: 5,
    selected: false,
  },
  parameters: {
    apolloClient: {
      mocks: [getSpruceConfigMock],
    },
  },
};
