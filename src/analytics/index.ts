export {
  usePatchAnalytics,
  useVersionAnalytics,
} from "./patch/usePatchOrVersionAnalytics";
export { useTaskAnalytics } from "./task/useTaskAnalytics";
export type { Analytics as TaskAnalytics } from "./task/useTaskAnalytics";
export { useAnnotationAnalytics } from "./task/useAnnotationAnalytics";
export { useUserPatchesAnalytics } from "./patches/useUserPatchesAnalytics";
export { useNavbarAnalytics } from "./navbar/useNavbarAnalytics";
export { useBreadcrumbAnalytics } from "./breadcrumb/useBreadcrumbAnalytics";
export type { Analytics as BreadcrumbAnalytics } from "./breadcrumb/useBreadcrumbAnalytics";
export { useHostsTableAnalytics } from "./hostsTable/useHostsTableAnalytics";
export { useTaskQueueAnalytics } from "./taskQueue/useTaskQueueAnalytics";
export { useAnalyticsAttributes } from "./useAnalyticsAttributes";
export { useSpawnAnalytics } from "./spawn/useSpawnAnalytics";
export { usePreferencesAnalytics } from "./preferences/usePreferencesAnalytics";
export { useJobLogsAnalytics } from "./joblogs/useJobLogsAnalytics";
