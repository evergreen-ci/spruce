import { IssuesQuery } from "gql/generated/types";
import { Unpacked } from "types/utils";

type AnnotationTickets = IssuesQuery["task"]["annotation"]["issues"];
type AnnotationTicket = Unpacked<AnnotationTickets>;

export type { AnnotationTickets, AnnotationTicket };
