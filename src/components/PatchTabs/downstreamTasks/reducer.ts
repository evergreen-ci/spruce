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
  | { type: "onChangeBaseStatusesSelector"; baseStatuses: string[] }
  | { type: "onChangeStatusesSelector"; statuses: string[] }
  | { type: "onChangeTaskNameInput"; task: string }
  | { type: "onChangeVariantInput"; variant: string }
  | { type: "onFilterBaseStatusesSelector" }
  | { type: "onFilterStatusesSelector" }
  | { type: "onFilterTaskNameInput" }
  | { type: "onFilterVariantInput" }
  | { type: "onResetBaseStatusesSelector" }
  | { type: "onResetStatusesSelector" }
  | { type: "onResetTaskNameInput" }
  | { type: "onResetVariantInput" }
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
    case "onChangeBaseStatusesSelector":
      return { ...state, baseStatusesInputVal: action.baseStatuses };
    case "onChangeStatusesSelector":
      return {
        ...state,
        currentStatusesInputVal: action.statuses,
      };
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
    case "onFilterBaseStatusesSelector":
      return {
        ...state,
        baseStatuses: state.baseStatusesInputVal,
        ...resetPage,
      };
    case "onFilterStatusesSelector":
      return {
        ...state,
        statuses: state.currentStatusesInputVal,
        ...resetPage,
      };
    case "onResetTaskNameInput":
      return {
        ...state,
        currentStatusesInputVal: [],
        statuses: [],
        ...resetPage,
      };
    case "onResetVariantInput":
      return {
        ...state,
        variantInputVal: "",
        variant: "",
        ...resetPage,
      };
    case "onResetBaseStatusesSelector":
      return {
        ...state,
        baseStatusesInputVal: [],
        baseStatuses: [],
        ...resetPage,
      };
    case "onResetStatusesSelector":
      return {
        ...state,
        currentStatusesInputVal: [],
        statuses: [],
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
        page: action.page,
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
