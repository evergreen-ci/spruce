import { CustomMeta, CustomStoryObj } from "test_utils/types";
import JiraTicketRow from ".";

export default {
  component: JiraTicketRow,
} satisfies CustomMeta<typeof JiraTicketRow>;

export const Default: CustomStoryObj<typeof JiraTicketRow> = {
  render: (args) => <JiraTicketRow {...args} />,
  argTypes: {},
  args: {
    jiraKey: "DEVPROD-123",
    fields: {
      summary: "Create the JiraTicketRow component",
      status: {
        name: "Closed",
        id: "id",
      },
      created: "2020-01-02",
      updated: "2023-11-21",
      assigneeDisplayName: "mohamed.khelif",
    },
  },
};
