import WithToastContext from "test_utils/toast-decorator";
import { CustomMeta, CustomStoryObj } from "test_utils/types";
import CustomCreatedTickets from "./CustomCreatedTickets";

export default {
  component: CustomCreatedTickets,
  decorators: [(Story: () => JSX.Element) => WithToastContext(Story)],
} satisfies CustomMeta<typeof CustomCreatedTickets>;

export const Default: CustomStoryObj<typeof CustomCreatedTickets> = {
  render: (args) => <CustomCreatedTickets {...args} />,
  argTypes: {},
  args: {
    execution: 0,
    taskId: "123",
    tickets: [
      {
        confidenceScore: 0.25,
        issueKey: "DEVPROD-1",
        jiraTicket: {
          key: "key",
          fields: {
            summary: "Issue Summary",
            status: {
              id: "id",
              name: "Done",
            },
            created: "2020-01-27",
            updated: "2023-11-28",
            assigneeDisplayName: "sophie.stadler",
            assignedTeam: "evg-ui",
          },
        },
        url: "https://spruce.mongodb.com",
      },
      {
        confidenceScore: 0.5,
        issueKey: "DEVPROD-2",
        jiraTicket: {
          key: "key",
          fields: {
            summary: "Issue Summary",
            status: {
              id: "id",
              name: "In Progress",
            },
            created: "2020-01-28",
            updated: "2023-11-29",
            assigneeDisplayName: "mohamed.khelif",
            assignedTeam: "evg-ui",
          },
        },
        url: "https://spruce.mongodb.com",
      },
    ],
  },
};
