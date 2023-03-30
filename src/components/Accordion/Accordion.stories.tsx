import { StoryObj } from "@storybook/react";
import { Accordion } from ".";

export default {
  title: "Components/Accordion",
  component: Accordion,
};

export const Default: StoryObj<typeof Accordion> = {
  render: (args) => <Accordion {...args} />,
  args: {
    title: "Accordion",
    children: "Accordion content",
  },
};

export const WithSubtitle: StoryObj<typeof Accordion> = {
  render: (args) => <Accordion {...args} />,
  args: {
    title: "Accordion",
    subtitle: "Subtitle",
    children: "Accordion content",
  },
};
