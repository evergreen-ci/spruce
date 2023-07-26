import { getSpruceConfigMock } from "gql/mocks/getSpruceConfig";
import { CustomStoryObj, CustomMeta } from "test_utils/types";

import FoldedCommit from ".";
import { foldedCommitData } from "./testData";

export default {
  component: FoldedCommit,
  title: "components/HistoryTable/FoldedCommit",
} satisfies CustomMeta<typeof FoldedCommit>;

export const FoldedCommitStory: CustomStoryObj<typeof FoldedCommit> = {
  args: {
    data: foldedCommitData,
    index: 0,
    numVisibleCols: 5,
    selected: false,
  },
  parameters: {
    apolloClient: {
      mocks: [getSpruceConfigMock],
    },
  },
  render: (args) => <FoldedCommit {...args} />,
};
