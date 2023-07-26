import { CustomStoryObj, CustomMeta } from "test_utils/types";

import LoadingRow from ".";

export default {
  component: LoadingRow,
  title: "components/HistoryTable/LoadingSection/LoadingRow",
} satisfies CustomMeta<typeof LoadingRow>;

export const LoadingRowStory: CustomStoryObj<typeof LoadingRow> = {
  render: (args) => <LoadingRow {...args} />,
  args: {
    numVisibleCols: 3,
  },
};
