import React from "react";
import { IssueLink } from "gql/generated/types";
import { AnnotationTicketsTable } from "./AnnotationTicketsTable";
import { TicketsTitle, TitleAndButtons } from "./BBComponents";

interface Props {
  tickets: IssueLink[];
  title: string;
}

export const AnnotationTickets: React.FC<Props> = ({ tickets, title }) => {
  const length = tickets?.length ?? 0;
  return (
    <>
      {length > 0 && (
        <>
          <TitleAndButtons>
            <TicketsTitle>{title} </TicketsTitle>
          </TitleAndButtons>
          <AnnotationTicketsTable jiraIssues={tickets} />{" "}
        </>
      )}
    </>
  );
};
