import { useContext, useMemo } from "react";
import {
  createSettingsContext,
  getUseHasUnsavedTab,
  getUsePopulateForm,
  SettingsState,
  useSettingsState,
} from "./Context";

export type TestRoutes = "foo" | "bar";

export type FormStateMap = {
  foo: {
    capsLockEnabled: boolean;
  };
  bar: {
    name: string;
    age: number;
  };
};

export const initialData = {
  foo: { capsLockEnabled: true },
  bar: { name: "Sophie", age: 26 },
};

const formToGqlMap = {
  foo: (form: FormStateMap["foo"]) => form,
  bar: (form: FormStateMap["bar"]) => form,
};

const TestContext = createSettingsContext<TestRoutes, FormStateMap>();

const TestProvider = ({ children }) => {
  const { getTab, saveTab, setInitialData, tabs, updateForm } =
    useSettingsState(["foo", "bar"], formToGqlMap);

  const contextValue = useMemo(
    () => ({
      getTab,
      saveTab,
      setInitialData,
      tabs,
      updateForm,
    }),
    [getTab, saveTab, setInitialData, tabs, updateForm],
  );

  return (
    <TestContext.Provider value={contextValue}>{children}</TestContext.Provider>
  );
};

const useTestContext = (): SettingsState<TestRoutes, FormStateMap> => {
  const context = useContext(TestContext);
  if (context === undefined) {
    throw new Error(
      "useProjectSettingsContext must be used within a ProjectSettingsProvider",
    );
  }
  return context;
};

const useHasUnsavedTab = getUseHasUnsavedTab(TestContext);
const usePopulateForm = getUsePopulateForm(TestContext);

export { TestProvider, useHasUnsavedTab, usePopulateForm, useTestContext };
