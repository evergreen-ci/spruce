import { actions } from "@storybook/addon-actions";
import { StoryObj } from "@storybook/react";
import Breadcrumbs from ".";

export default {
  component: Breadcrumbs,
};

export const Default: StoryObj<typeof Breadcrumbs> = {
  render: () => (
    <Breadcrumbs
      breadcrumbs={[
        {
          text: "spruce",
          to: "/commits/spruce",
          onClick: () => actions("Clicked first link"),
        },
        { text: "511232" },
      ]}
    />
  ),
};
