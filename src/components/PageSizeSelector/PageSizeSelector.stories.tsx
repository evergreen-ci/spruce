import { actions } from "@storybook/addon-actions";
import { PageSizeSelector } from ".";

export default {
  title: "PageSizeSelector",
  component: PageSizeSelector,
};

export const Default = () => (
  <PageSizeSelector
    data-cy="my-patches-page-size-selector"
    value={10}
    sendAnalyticsEvent={() => actions("Change Page Size")}
  />
);
