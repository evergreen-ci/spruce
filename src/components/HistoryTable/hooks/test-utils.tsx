import { MockedProvider, MockedResponse } from "@apollo/client/testing";
import {
  HistoryTableProvider,
  useHistoryTable as useHistoryTableActual,
} from "../HistoryTableContext";

type UseHistoryTableTestHookType = <T extends (...args: any) => any | any[]>(
  useHook: T
) => (
  ...args: Parameters<T>
) => {
  hookResponse: ReturnType<T>;
  historyTable: ReturnType<typeof useHistoryTableActual>;
};
/** useHistoryTableTestHook takes a hook and useHistoryTable hooks
 * and combines them into a shared hook which can be rendered under the same wrapper context
 * and can be used together */
const useHistoryTableTestHook: UseHistoryTableTestHookType = (useHook) => (
  args
) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const hookResponse = useHook(...args);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const historyTable = useHistoryTableActual();
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
