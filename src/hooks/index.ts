import { useDefaultPath } from "hooks/useDefaultPath";
import { useDisableTableSortersIfLoading } from "hooks/useDisableTableSortersIfLoading";
import { useEffect, useRef } from "react";
import { useFilterInputChangeHandler } from "hooks/useFilterInputChangeHandler";
import { useGetUserPatchesPageTitleAndLink } from "hooks/useGetUserPatchesPageTitleAndLink";
import { useLegacyUIURL } from "hooks/useLegacyUIURL";
import { useNotificationModal } from "hooks/useNotificationModal";
import { useOnClickOutside } from "hooks/useOnClickOutside";
import { usePageTitle } from "hooks/usePageTitle";
import { usePatchStatusSelect } from "hooks/usePatchStatusSelect";
import { usePollQuery } from "hooks/usePollQuery";
import { useSetColumnDefaultSortOrder } from "hooks/useSetColumnDefaultSortOrder";
import { useStatusesFilter } from "hooks/useStatusesFilter";
import { useTabs } from "hooks/useTabs";

export const usePrevious = <T>(state: T): T | undefined => {
  const ref = useRef<T>();
  useEffect(() => {
    ref.current = state;
  }, [state]);
  return ref.current;
};

export {
  useDefaultPath,
  useDisableTableSortersIfLoading,
  useFilterInputChangeHandler,
  useGetUserPatchesPageTitleAndLink,
  useLegacyUIURL,
  useNotificationModal,
  useOnClickOutside,
  usePageTitle,
  usePatchStatusSelect,
  usePollQuery,
  useSetColumnDefaultSortOrder,
  useStatusesFilter,
  useTabs,
};
