import { MockedProvider, MockedResponse } from "@apollo/client/testing";
import {
  HistoryTableProvider,
  useHistoryTable as useHistoryTableActual,
} from "../HistoryTableContext";

// generic T is a hook type
// generic R is the return type of the hook
type HookType<T, R> = (args: T) => R;

type UseHistoryTableTestHookType = <T, R>(
  useHook: HookType<T, R>
) => (
  props: T
) => {
  hookResponse: R;
  historyTable: ReturnType<typeof useHistoryTableActual>;
};
/** useHistoryTableTestHook takes a hook and useHistoryTable hooks
 * and combines them into a shared hook which can be rendered under the same wrapper context
 * and can be used together */
const useHistoryTableTestHook: UseHistoryTableTestHookType = (useHook) => (
  props
) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const hookResponse = useHook(props);
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
