import { TableProps } from "antd/es/table";

export interface ValidInitialQueryParams {
  initialCategory: string | string[];
  initialSort: string | string[];
  initialStatuses: string | string[];
}

export enum RequiredQueryParams {
  Sort = "sort",
  Category = "category",
  Statuses = "statuses"
}

export enum SortQueryParam {
  Desc = "-1",
  Asc = "1"
}

export enum PatchTasksQueryParams {
  SortBy = "sortBy",
  SortDir = "sortDir",
  Page = "page",
  Limit = "limit"
}

export type TableOnChange<D> = TableProps<D>["onChange"];
