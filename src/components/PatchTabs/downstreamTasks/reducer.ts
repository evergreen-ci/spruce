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
  | { type: "onChangeBaseStatusesSelector"; data: string[] }
  | { type: "onChangeStatusesSelector"; data: string[] }
  | { type: "onChangeTaskNameInput"; data: string }
  | { type: "onChangeVariantInput"; data: string }
  | { type: "onFilterBaseStatusesSelector" }
  | { type: "onFilterStatusesSelector" }
  | { type: "onFilterTaskNameInput" }
  | { type: "onFilterVariantInput" }
  | { type: "onResetBaseStatusesSelector" }
  | { type: "onResetStatusesSelector" }
  | { type: "onResetTaskNameInput" }
  | { type: "onResetVariantInput" }
  | { type: "clearAllFilters" }
  | { type: "onSort"; data: SortOrder[] }
  | { type: "onChangePagination"; data: number }
  | { type: "onChangeLimit"; data: number };

export type State = QueryParamState & InputValueState;
const resetPage = { page: 0 };
export const reducer = (state: State, action: Action) => {
  switch (action.type) {
    case "onChangeTaskNameInput":
      return {
        ...state,
        taskNameInputVal: action.data,
      };
    case "onChangeVariantInput":
      return { ...state, variantInputVal: action.data };
    case "onChangeBaseStatusesSelector":
      return { ...state, baseStatusesInputVal: action.data };
    case "onChangeStatusesSelector":
      return {
        ...state,
        currentStatusesInputVal: action.data,
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
        sorts: action.data,
      };
    case "onChangePagination":
      return {
        ...state,
        page: action.data,
      };
    case "onChangeLimit":
      return {
        ...state,
        ...resetPage,
        limit: action.data,
      };
    default:
      throw new Error("Unknown action type");
  }
};
