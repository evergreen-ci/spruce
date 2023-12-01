import { CustomMeta, CustomStoryObj } from "test_utils/types";
import AnnotationTicketRowWithActionProps from ".";

export default {
  component: AnnotationTicketRowWithActionProps,
} satisfies CustomMeta<typeof AnnotationTicketRowWithActionProps>;

export const Default: CustomStoryObj<
  typeof AnnotationTicketRowWithActionProps
> = {
  render: (args) => <AnnotationTicketRowWithActionProps {...args} />,
  argTypes: {},
  args: {
    issueKey: "EVG-123",
    url: "https://www.google.com",
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
    confidenceScore: 0.5,
    loading: false,
    userCanModify: true,
    isIssue: true,
  },
};
