import { CustomStoryObj, CustomMeta } from "test_utils/types";
import { AnnotationTicketRow } from "./AnnotationTicketRow";

export default {
  component: AnnotationTicketRow,
  title: "Pages/Task/BuildBaron/AnnotationTicketRow",
} satisfies CustomMeta<typeof AnnotationTicketRow>;

export const Default: CustomStoryObj<typeof AnnotationTicketRow> = {
  argTypes: {
    confidenceScore: {
      control: {
        max: 1,
        min: 0,
        step: 0.01,
        type: "range",
      },
    },
  },
  args: {
    confidenceScore: 0.5,
  },
  render: (args) => (
    <AnnotationTicketRow
      issueKey="EVG-123"
      url="https://www.google.com"
      jiraTicket={{
        fields: {
          assignedTeam: "evg-ui",
          assigneeDisplayName: "mohamed.khelif",
          created: "2020-01-02",
          status: {
            id: "id",
            name: "status",
          },
          summary: "summary",
          updated: "2020-01-02",
        },
        key: "key",
      }}
      {...args}
    />
  ),
};
