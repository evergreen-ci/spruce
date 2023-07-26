import WithToastContext from "test_utils/toast-decorator";
import { CustomStoryObj, CustomMeta } from "test_utils/types";
import ConfigurePatchCore from ".";
import { patchQuery, mocks } from "./testData";

export default {
  component: ConfigurePatchCore,
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
  title: "pages/configurePatch/configurePatchCore",
} satisfies CustomMeta<typeof ConfigurePatchCore>;

export const ConfigureTasksDefault: CustomStoryObj<typeof ConfigurePatchCore> =
  {
    args: {
      patch: patchQuery.patch,
    },
    render: (args) => <ConfigurePatchCore {...args} />,
  };
