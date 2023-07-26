import { CustomStoryObj, CustomMeta } from "test_utils/types";

import LoadingSection from ".";

export default {
  component: LoadingSection,
  title: "components/HistoryTable/LoadingSection",
} satisfies CustomMeta<typeof LoadingSection>;

export const LoadingSectionStory: CustomStoryObj<typeof LoadingSection> = {
  render: (args) => <LoadingSection {...args} />,
  args: {
    numVisibleCols: 7,
    numLoadingRows: 5,
  },
};
