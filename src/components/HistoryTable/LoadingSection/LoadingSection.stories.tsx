import { StoryObj } from "@storybook/react";
import LoadingSection from ".";

export default {
  component: LoadingSection,
  title: "components/HistoryTable/LoadingSection",
};

export const LoadingSectionStory: StoryObj<typeof LoadingSection> = {
  render: (args) => <LoadingSection {...args} />,
  args: {
    numVisibleCols: 7,
    numLoadingRows: 5,
  },
};
