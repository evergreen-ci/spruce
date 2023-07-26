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
    reactRouter: {
      path: "/version/:id",
      route: "/version/version",
    },
  },
} satisfies CustomMeta<typeof BuildVariantCard>;

export const Default: CustomStoryObj<typeof BuildVariantCard> = {
  render: (args) => <BuildVariantCard {...args} />,
};
