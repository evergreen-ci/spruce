import React from "react";
import { IssueLink } from "gql/generated/types";
import { AnnotationTicketsTable } from "./AnnotationTicketsTable";
import { TicketsTitle, TitleAndButtons } from "./BBComponents";

interface Props {
  tickets: IssueLink[];
  title: string;
}

export const AnnotationTickets: React.FC<Props> = ({ tickets, title }) => (
  <>
    {tickets?.length && (
      <>
        <TitleAndButtons>
          <TicketsTitle>{title} </TicketsTitle>
        </TitleAndButtons>
        <AnnotationTicketsTable jiraIssues={tickets} />{" "}
      </>
    )}
  </>
);
