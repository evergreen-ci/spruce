import { useEffect, useRef } from "react";
import { useTabs } from "hooks/useTabs";
import { useDefaultPath } from "hooks/useDefaultPath";
import { useDisableTableSortersIfLoading } from "hooks/useDisableTableSortersIfLoading";
import { useOnClickOutside } from "hooks/useOnClickOutside";
import { useFilterInputChangeHandler } from "hooks/useFilterInputChangeHandler";
import { useStatusesFilter } from "hooks/useStatusesFilter";

export const usePrevious = <T>(state: T): T | undefined => {
  const ref = useRef<T>();
  useEffect(() => {
    ref.current = state;
  }, [state]);
  return ref.current;
};

export {
  useTabs,
  useDefaultPath,
  useDisableTableSortersIfLoading,
  useOnClickOutside,
  useFilterInputChangeHandler,
  useStatusesFilter,
};
