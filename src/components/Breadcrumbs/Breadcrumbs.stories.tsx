import { actions } from "@storybook/addon-actions";
import { CustomStoryObj, CustomMeta } from "test_utils/types";
import Breadcrumbs from ".";

export default {
  component: Breadcrumbs,
} satisfies CustomMeta<typeof Breadcrumbs>;

export const Default: CustomStoryObj<typeof Breadcrumbs> = {
  render: () => (
    <Breadcrumbs
      breadcrumbs={[
        {
          onClick: () => actions("Clicked first link"),
          text: "spruce",
          to: "/commits/spruce",
        },
        { text: "511232" },
      ]}
    />
  ),
};
