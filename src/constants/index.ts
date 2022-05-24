import Cookies from "js-cookie";
import { DISABLE_QUERY_POLLING } from "./cookies";

// 1000 ms = 1 second
export const SECOND = 1000;

export const TOAST_TIMEOUT = 30 * SECOND;
export const pollInterval =
  Cookies.get(DISABLE_QUERY_POLLING) === "true" ? 0 : 60 * SECOND;
export const PAGE_SIZES = [10, 20, 50, 100];
export const RECENT_PAGE_SIZE_KEY = "recentPageSize";
export const DEFAULT_PAGE_SIZE = 10;
