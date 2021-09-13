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
const page = { page: 0 };
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
        ...page,
      };
    case "onFilterVariantInput":
      return {
        ...state,
        variant: state.variantInputVal,
        ...page,
      };
    case "onFilterBaseStatusesSelector":
      return {
        ...state,
        baseStatuses: state.baseStatusesInputVal,
        ...page,
      };
    case "onFilterStatusesSelector":
      return {
        ...state,
        statuses: state.currentStatusesInputVal,
        ...page,
      };
    case "onResetTaskNameInput":
      return {
        ...state,
        currentStatusesInputVal: [],
        statuses: [],
        ...page,
      };
    case "onResetVariantInput":
      return {
        ...state,
        variantInputVal: "",
        variant: "",
        ...page,
      };
    case "onResetBaseStatusesSelector":
      return {
        ...state,
        baseStatusesInputVal: [],
        baseStatuses: [],
        ...page,
      };
    case "onResetStatusesSelector":
      return {
        ...state,
        currentStatusesInputVal: [],
        statuses: [],
        ...page,
      };
    case "clearAllFilters":
      return {
        ...state,
        ...page,
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
        ...page,
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
        ...page,
        limit: action.data,
      };
    default:
      throw new Error("Unknown action type");
  }
};
