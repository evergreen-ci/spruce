import { useMemo } from "react";
import { MockedProvider, MockedResponse } from "@apollo/client/testing";
import { HistoryTableProvider, useHistoryTable } from "../HistoryTableContext";

type UseHistoryTableTestHookType = <T extends (...args: any) => any | any[]>(
  useHook: T,
  args: Parameters<T>
) => {
  hookResponse: ReturnType<T>;
  historyTable: ReturnType<typeof useHistoryTable>;
};
/** useHistoryTableTestHook takes a hook and useHistoryTable hooks
 * and combines them into a shared hook which can be rendered under the same wrapper context
 * and can be used together */
const useHistoryTableTestHook: UseHistoryTableTestHookType = (
  useHook,
  args
) => {
  const memoizedArgs = useMemo(() => args, [args]);
  const hookResponse = useHook(...memoizedArgs);
  const historyTable = useHistoryTable();

  return {
    hookResponse,
    historyTable,
  };
};

interface ProviderProps {
  children: React.ReactNode;
  mocks?: MockedResponse[];
}

const ProviderWrapper: React.FC<ProviderProps> = ({ children, mocks = [] }) => (
  <MockedProvider mocks={mocks}>
    <HistoryTableProvider>{children}</HistoryTableProvider>
  </MockedProvider>
);

export { useHistoryTableTestHook, ProviderWrapper };
