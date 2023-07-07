import { useContext } from "react";
import {
  createSettingsContext,
  hasUnsavedTab,
  populateForm,
  useSettingsState,
} from "components/Settings/Context2";
import { Writable, WritableTabRoutes } from "./tabs/types";

const routes = Object.values(Writable);
const Context = createSettingsContext<WritableTabRoutes>();

const ProjectSettingsProvider = ({ children }) => {
  const { getTab, saveTab, setInitialData, tabs, updateForm } =
    useSettingsState(routes);

  return (
    <Context.Provider
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
    </Context.Provider>
  );
};

const useProjectSettingsContext = () => {
  const context = useContext(Context);
  if (context === undefined) {
    throw new Error(
      "useSettingsContext must be used within a ProjectSettingsProvider"
    );
  }
  return context;
};

const useHasUnsavedTab = hasUnsavedTab(Context);
const usePopulateForm = populateForm(Context);

export {
  ProjectSettingsProvider,
  useHasUnsavedTab,
  usePopulateForm,
  useProjectSettingsContext,
};
