import { GetIssuesQuery } from "gql/generated/types";
import { Unpacked } from "types/utils";

type AnnotationTickets = GetIssuesQuery["task"]["annotation"]["issues"];
type AnnotationTicket = Unpacked<AnnotationTickets>;

export type { AnnotationTickets, AnnotationTicket };
