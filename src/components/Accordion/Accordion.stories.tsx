import { CustomMeta, CustomStoryObj } from "test_utils/types";
import { Accordion } from ".";

export default {
  component: Accordion,
} satisfies CustomMeta<typeof Accordion>;

export const Default: CustomStoryObj<typeof Accordion> = {
  render: (args) => <Accordion {...args} />,
  args: {
    title: "Accordion",
    children: "Accordion content",
  },
};

export const WithSubtitle: CustomStoryObj<typeof Accordion> = {
  render: (args) => <Accordion {...args} />,
  args: {
    title: "Accordion",
    subtitle: "Subtitle",
    children: "Accordion content",
  },
};
