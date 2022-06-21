import { AnnotationTicketRow } from "./AnnotationTicketRow";

export default {
  title: "Pages/BuildBaron/AnnotationTicketRow",
  component: AnnotationTicketRow,
  args: {
    confidenceScore: 0.5,
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

export const Default = (args) => (
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
);
