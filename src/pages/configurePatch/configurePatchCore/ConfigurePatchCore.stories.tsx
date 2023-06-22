import { StoryObj } from "@storybook/react";
import WithToastContext from "test_utils/toast-decorator";
import ConfigurePatchCore from ".";
import { patchQuery, mocks } from "./testData";

export default {
  component: ConfigurePatchCore,
  title: "pages/configurePatch/configurePatchCore",
  decorators: [(Story: () => JSX.Element) => WithToastContext(Story)],
  parameters: {
    apolloClient: {
      mocks,
    },
    reactRouter: {
      initialEntries: [`/patch/${patchQuery.patch.id}/configure`],
      path: "/patch/:patchId/configure/*",
      route: `/patch/${patchQuery.patch.id}/configure/tasks`,
    },
  },
};

export const ConfigureTasksDefault: StoryObj<typeof ConfigurePatchCore> = {
  render: (args) => <ConfigurePatchCore {...args} />,
  args: {
    patch: patchQuery.patch,
  },
};
