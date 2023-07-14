import { useContext } from "react";
import {
  createSettingsContext,
  hasUnsavedTab,
  populateForm,
  useSettingsState,
} from "components/Settings/Context";
import { formToGqlMap } from "./tabs/transformers";
import { FormStateMap, Writable, WritableTabRoutes } from "./tabs/types";

const routes = Object.values(Writable);
const ProjectSettingsContext = createSettingsContext<
  WritableTabRoutes,
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

const useProjectSettingsContext = () => {
  const context = useContext(ProjectSettingsContext);
  if (context === undefined) {
    throw new Error(
      "useProjectSettingsContext must be used within a ProjectSettingsProvider"
    );
  }
  return context;
};

const useHasUnsavedTab = hasUnsavedTab(ProjectSettingsContext);
const usePopulateForm = populateForm(ProjectSettingsContext);

export {
  ProjectSettingsProvider,
  useHasUnsavedTab,
  usePopulateForm,
  useProjectSettingsContext,
};
