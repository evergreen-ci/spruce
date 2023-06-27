import { getCommitsRoute } from "constants/routes";

import WithToastContext from "test_utils/toast-decorator";
import { CustomStoryObj, CustomMeta } from "test_utils/types";
import { ProjectSelect } from ".";
import { mocks } from "./testData";

export default {
  component: ProjectSelect,
  decorators: [(Story: () => JSX.Element) => WithToastContext(Story)],
  parameters: {
    apolloClient: {
      mocks,
    },
  },
} satisfies CustomMeta<typeof ProjectSelect>;

export const Default: CustomStoryObj<typeof ProjectSelect> = {
  render: () => (
    <ProjectSelect
      selectedProjectIdentifier="evergreen"
      getRoute={getCommitsRoute}
    />
  ),
};

export const WithClickableHeader: CustomStoryObj<typeof ProjectSelect> = {
  render: () => (
    <ProjectSelect
      selectedProjectIdentifier="evergreen"
      getRoute={getCommitsRoute}
      isProjectSettingsPage
    />
  ),
};
