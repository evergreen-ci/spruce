import { actions } from "@storybook/addon-actions";
import Breadcrumbs from ".";

export default {
  title: "Breadcrumbs",
  component: Breadcrumbs,
};

export const Default = () => (
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
);
