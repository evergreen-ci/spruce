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
  WritableProjectSettingsTabs,
  WritableProjectSettingsType,
} from "./tabs/types";

const routes = Object.values(WritableProjectSettingsTabs);
const ProjectSettingsContext = createSettingsContext<
  WritableProjectSettingsType,
  FormStateMap
>();

const ProjectSettingsProvider = ({ children }) => {
  const { getTab, saveTab, setInitialData, tabs, updateForm } =
    useSettingsState(routes, formToGqlMap);

  return (
    <ProjectSettingsContext.Provider
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
    </ProjectSettingsContext.Provider>
  );
};

const useProjectSettingsContext = (): SettingsState<
  WritableProjectSettingsType,
  FormStateMap
> => {
  const context = useContext(ProjectSettingsContext);
  if (context === undefined) {
    throw new Error(
      "useProjectSettingsContext must be used within a ProjectSettingsProvider"
    );
  }
  return context;
};

const useHasUnsavedTab = getUseHasUnsavedTab(ProjectSettingsContext);
const usePopulateForm = getUsePopulateForm(ProjectSettingsContext);

export {
  ProjectSettingsProvider,
  useHasUnsavedTab,
  usePopulateForm,
  useProjectSettingsContext,
};
