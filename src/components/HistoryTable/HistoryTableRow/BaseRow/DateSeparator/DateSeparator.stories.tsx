import { getUserMock } from "gql/mocks/getUser";
import { CustomMeta, CustomStoryObj } from "test_utils/types";

import DateSeparator from ".";

export default {
  component: DateSeparator,
  title: "components/HistoryTable/DateSeparator",
} satisfies CustomMeta<typeof DateSeparator>;

export const DateSeparatorStory: CustomStoryObj<typeof DateSeparator> = {
  render: (args) => <DateSeparator {...args} />,
  args: {
    date: new Date("2021-01-01"),
  },
  parameters: {
    apolloClient: {
      mocks: [getUserMock],
    },
  },
};
