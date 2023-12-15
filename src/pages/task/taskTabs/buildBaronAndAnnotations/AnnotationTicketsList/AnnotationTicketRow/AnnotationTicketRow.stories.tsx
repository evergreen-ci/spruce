import { CustomStoryObj, CustomMeta } from "test_utils/types";
import AnnotationTicketRow from ".";

export default {
  component: AnnotationTicketRow,
} satisfies CustomMeta<typeof AnnotationTicketRow>;

export const Default: CustomStoryObj<typeof AnnotationTicketRow> = {
  render: (args) => (
    <AnnotationTicketRow
      issueKey="EVG-123"
      url="https://www.google.com"
      jiraTicket={{
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
      }}
      {...args}
    />
  ),
  args: {
    confidenceScore: 0.5,
    loading: false,
  },
  argTypes: {
    confidenceScore: {
      control: {
        type: "range",
        min: 0,
        max: 1,
        step: 0.01,
      },
    },
  },
};
