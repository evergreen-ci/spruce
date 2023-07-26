import { CustomMeta, CustomStoryObj } from "test_utils/types";
import { Accordion } from ".";

export default {
  component: Accordion,
} satisfies CustomMeta<typeof Accordion>;

export const Default: CustomStoryObj<typeof Accordion> = {
  args: {
    children: "Accordion content",
    title: "Accordion",
  },
  render: (args) => <Accordion {...args} />,
};

export const WithSubtitle: CustomStoryObj<typeof Accordion> = {
  args: {
    children: "Accordion content",
    subtitle: "Subtitle",
    title: "Accordion",
  },
  render: (args) => <Accordion {...args} />,
};
