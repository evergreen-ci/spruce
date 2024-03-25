import { SortOrder } from "gql/generated/types";

interface QueryParamState {
  baseStatuses: string[];
  limit: number;
  page: number;
  sorts: SortOrder[];
  statuses: string[];
  taskName: string;
  variant: string;
}

export type Action =
  | { type: "setTaskName"; task: string }
  | { type: "setVariant"; variant: string }
  | { type: "setBaseStatuses"; baseStatuses: string[] }
  | { type: "setStatuses"; statuses: string[] }
  | { type: "clearAllFilters" }
  | { type: "setSorts"; sorts: SortOrder[] }
  | { type: "setPage"; page: number }
  | { type: "setLimit"; limit: number };

export type State = QueryParamState;
const resetPage = { page: 0 };
export const reducer = (state: State, action: Action) => {
  switch (action.type) {
    case "setTaskName":
      return {
        ...state,
        taskName: action.task,
        ...resetPage,
      };
    case "setVariant":
      return {
        ...state,
        variant: action.variant,
        ...resetPage,
      };
    case "setBaseStatuses":
      return {
        ...state,
        baseStatuses: action.baseStatuses,
        ...resetPage,
      };
    case "setStatuses":
      return {
        ...state,
        statuses: action.statuses,
        ...resetPage,
      };
    case "clearAllFilters":
      return {
        ...state,
        ...resetPage,
        statuses: [],
        variant: "",
        baseStatuses: [],
        taskName: "",
      };
    case "setSorts":
      return {
        ...state,
        ...resetPage,
        sorts: action.sorts,
      };
    case "setPage":
      return {
        ...state,
        page: action.page < 0 ? 0 : action.page,
      };
    case "setLimit":
      return {
        ...state,
        ...resetPage,
        limit: action.limit,
      };
    default:
      throw new Error("Unknown action type");
  }
};
