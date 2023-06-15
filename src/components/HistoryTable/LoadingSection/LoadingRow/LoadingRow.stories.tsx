import { StoryObj } from "@storybook/react";
import LoadingRow from ".";

export default {
  component: LoadingRow,
  title: "components/HistoryTable/LoadingSection/LoadingRow",
};

export const LoadingRowStory: StoryObj<typeof LoadingRow> = {
  render: (args) => <LoadingRow {...args} />,
  args: {
    numVisibleCols: 3,
  },
};
