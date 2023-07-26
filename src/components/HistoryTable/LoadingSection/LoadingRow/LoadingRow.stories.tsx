import { CustomStoryObj, CustomMeta } from "test_utils/types";

import LoadingRow from ".";

export default {
  component: LoadingRow,
  title: "components/HistoryTable/LoadingSection/LoadingRow",
} satisfies CustomMeta<typeof LoadingRow>;

export const LoadingRowStory: CustomStoryObj<typeof LoadingRow> = {
  args: {
    numVisibleCols: 3,
  },
  render: (args) => <LoadingRow {...args} />,
};
