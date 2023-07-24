import { useContext } from "react";
import {
  createSettingsContext,
  getUseHasUnsavedTab,
  getUsePopulateForm,
  SettingsState,
  useSettingsState,
} from "components/Settings/Context";
import { formToGqlMap } from "./tabs/transformers";
import {
  FormStateMap,
  WritableDistroSettingsTabs,
  WritableDistroSettingsType,
} from "./tabs/types";

const routes = Object.values(WritableDistroSettingsTabs);
const DistroSettingsContext = createSettingsContext<
  WritableDistroSettingsType,
  FormStateMap
>();

const DistroSettingsProvider: React.VFC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { getTab, saveTab, setInitialData, tabs, updateForm } =
    useSettingsState(routes, formToGqlMap);

  return (
    <DistroSettingsContext.Provider
      // eslint-disable-next-line react/jsx-no-constructed-context-values
      value={{
        getTab,
        saveTab,
        setInitialData,
        tabs,
        updateForm,
      }}
    >
      {children}
    </DistroSettingsContext.Provider>
  );
};

const useDistroSettingsContext = (): SettingsState<
  WritableDistroSettingsType,
  FormStateMap
> => {
  const context = useContext(DistroSettingsContext);
  if (context === undefined) {
    throw new Error(
      "useDistroSettingsContext must be used within a DistroSettingsProvider"
    );
  }
  return context;
};

const useHasUnsavedTab = getUseHasUnsavedTab(DistroSettingsContext);
const usePopulateForm = getUsePopulateForm(DistroSettingsContext);

export {
  DistroSettingsProvider,
  useHasUnsavedTab,
  usePopulateForm,
  useDistroSettingsContext,
};
