import WithToastContext from "test_utils/toast-decorator";
import { CustomMeta, CustomStoryObj } from "test_utils/types";
import AnnotationTicketsList from ".";

export default {
  component: AnnotationTicketsList,
  decorators: [(Story: () => JSX.Element) => WithToastContext(Story)],
} satisfies CustomMeta<typeof AnnotationTicketsList>;

export const Default: CustomStoryObj<typeof AnnotationTicketsList> = {
  render: (args) => <AnnotationTicketsList {...args} />,
  argTypes: {},
  args: {
    execution: 0,
    isIssue: true,
    taskId: "taskId",
    userCanModify: true,
    selectedRowKey: "key",
    loading: false,
    jiraIssues: [
      {
        confidenceScore: 0.5,
        issueKey: "DEVPROD-123",
        url: "https://example.com",
        jiraTicket: {
          key: "key",
          fields: {
            summary: "summary",
            status: {
              name: "status",
              id: "id",
            },
            created: "2020-01-02",
            updated: "2020-01-02",
            assigneeDisplayName: "mohamed.khelif",
            assignedTeam: "evg-ui",
          },
        },
      },
      {
        confidenceScore: 0.99,
        issueKey: "DEVPROD-456",
        url: "https://example.com",
        jiraTicket: {
          key: "key2",
          fields: {
            summary: "other summary",
            status: {
              name: "failed",
              id: "id",
            },
            created: "2020-01-02",
            updated: "2020-01-02",
            assigneeDisplayName: "sophie.stadler",
            assignedTeam: "evg-ui",
          },
        },
      },
    ],
  },
};
