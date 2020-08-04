import { useEffect, useRef } from "react";

export { useDefaultPath } from "hooks/useDefaultPath";
export { useDisableTableSortersIfLoading } from "hooks/useDisableTableSortersIfLoading";
export { useFilterInputChangeHandler } from "hooks/useFilterInputChangeHandler";
export { useGetUserPatchesPageTitleAndLink } from "hooks/useGetUserPatchesPageTitleAndLink";
export { useNotificationModal } from "hooks/useNotificationModal";
export { useOnClickOutside } from "hooks/useOnClickOutside";
export { usePatchStatusSelect } from "hooks/usePatchStatusSelect";
export { usePollQuery } from "hooks/usePollQuery";
export { useSetColumnDefaultSortOrder } from "hooks/useSetColumnDefaultSortOrder";
export { useLegacyUIURL } from "hooks/useLegacyUIURL";
export { usePageTitle } from "hooks/usePageTitle";
export { useNetworkStatus } from "hooks/useNetworkStatus";
export { useStatusesFilter } from "hooks/useStatusesFilter";
export { useTabs } from "hooks/useTabs";
export {
  useTableInputFilter,
  useTableCheckboxFilter,
} from "hooks/useTableFilters";
export { useUpdateUrlSortParamOnTableChange } from "./useUpdateUrlSortParamOnTableChange";

export const usePrevious = <T>(state: T): T | undefined => {
  const ref = useRef<T>();
  useEffect(() => {
    ref.current = state;
  }, [state]);
  return ref.current;
};
