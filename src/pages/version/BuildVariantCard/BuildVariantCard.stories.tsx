import { StoryObj } from "@storybook/react";
import BuildVariantCard from ".";
import { mocks } from "./testData";

export default {
  title: "Pages/Version/BuildVariantCard",
  component: BuildVariantCard,
  parameters: {
    apolloClient: {
      mocks,
    },
    reactRouter: {
      path: "/version/:id",
      route: "/version/version",
      params: { id: "version" },
    },
  },
};

export const Default: StoryObj<typeof BuildVariantCard> = {
  render: (args) => <BuildVariantCard {...args} />,
};
