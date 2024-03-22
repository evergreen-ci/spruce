import { CustomStoryObj, CustomMeta } from "test_utils/types";
import BuildVariantCard from ".";
import { mocks } from "./testData";

export default {
  title: "Pages/Version/BuildVariantCard",
  component: BuildVariantCard,
  parameters: {
    apolloClient: {
      mocks,
    },
  },
} satisfies CustomMeta<typeof BuildVariantCard>;

export const Default: CustomStoryObj<typeof BuildVariantCard> = {
  render: (args) => <BuildVariantCard {...args} />,
  args: {
    versionId: "version",
  },
};
