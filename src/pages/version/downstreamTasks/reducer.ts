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

interface InputValueState {
  baseStatusesInputVal: string[];
  currentStatusesInputVal: string[];
  taskNameInputVal: string;
  variantInputVal: string;
}

export type Action =
  | { type: "onChangeTaskNameInput"; task: string }
  | { type: "onChangeVariantInput"; variant: string }
  | { type: "onFilterTaskNameInput" }
  | { type: "onFilterVariantInput" }
  | { type: "setAndSubmitBaseStatusesSelector"; baseStatuses: string[] }
  | { type: "setAndSubmitStatusesSelector"; statuses: string[] }
  | { type: "clearAllFilters" }
  | { type: "onSort"; sorts: SortOrder[] }
  | { type: "onChangePagination"; page: number }
  | { type: "onChangeLimit"; limit: number };

export type State = QueryParamState & InputValueState;
const resetPage = { page: 0 };
export const reducer = (state: State, action: Action) => {
  switch (action.type) {
    case "onChangeTaskNameInput":
      return {
        ...state,
        taskNameInputVal: action.task,
      };
    case "onChangeVariantInput":
      return { ...state, variantInputVal: action.variant };
    case "onFilterTaskNameInput":
      return {
        ...state,
        taskName: state.taskNameInputVal,
        ...resetPage,
      };
    case "onFilterVariantInput":
      return {
        ...state,
        variant: state.variantInputVal,
        ...resetPage,
      };
    case "setAndSubmitBaseStatusesSelector":
      return {
        ...state,
        baseStatusesInputVal: action.baseStatuses,
        baseStatuses: action.baseStatuses,
        ...resetPage,
      };
    case "setAndSubmitStatusesSelector":
      return {
        ...state,
        currentStatusesInputVal: action.statuses,
        statuses: action.statuses,
        ...resetPage,
      };
    case "clearAllFilters":
      return {
        ...state,
        ...resetPage,
        currentStatusesInputVal: [],
        statuses: [],
        variantInputVal: "",
        variant: "",
        baseStatusesInputVal: [],
        baseStatuses: [],
        taskNameInputVal: "",
        taskName: "",
      };
    case "onSort":
      return {
        ...state,
        ...resetPage,
        sorts: action.sorts,
      };
    case "onChangePagination":
      return {
        ...state,
        page: action.page < 0 ? 0 : action.page,
      };
    case "onChangeLimit":
      return {
        ...state,
        ...resetPage,
        limit: action.limit,
      };
    default:
      throw new Error("Unknown action type");
  }
};
