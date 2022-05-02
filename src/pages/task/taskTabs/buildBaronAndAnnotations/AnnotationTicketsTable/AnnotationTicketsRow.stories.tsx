import { withKnobs, boolean, number } from "@storybook/addon-knobs";
import { AnnotationTicketRow } from "./AnnotationTicketsRow";

export default {
  title: "BuildBaron/AnnotationTicketRow",
  component: AnnotationTicketRow,
  decorators: [withKnobs],
};

export const Default = () => (
  <AnnotationTicketRow
    issueKey="EVG-123"
    url="https://www.google.com"
    source={{
      author: "author",
      time: new Date("2020-01-01"),
      requester: "requester",
    }}
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
    confidenceScore={number("confidenceScore", 0.5, {
      range: true,
      min: 0,
      max: 1,
      step: 0.01,
    })}
    loading={boolean("loading", false)}
  />
);
