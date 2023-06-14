import { MockedProvider } from "@apollo/client/testing";
import { StoryObj } from "@storybook/react";
import { getUserMock } from "gql/mocks/getUser";
import DateSeparator from ".";

export default {
  component: DateSeparator,
  title: "components/HistoryTable/DateSeparator",
};

export const DateSeparatorStory: StoryObj<typeof DateSeparator> = {
  render: (args) => <DateSeparator {...args} />,
  args: {
    date: new Date("2021-01-01"),
  },
  decorators: [
    (Story: () => JSX.Element) => (
      <MockedProvider mocks={[getUserMock]}>
        <Story />
      </MockedProvider>
    ),
  ],
};
