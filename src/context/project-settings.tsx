import { createContext, useContext, useEffect, useReducer } from "react";
import { FormDataProps } from "components/SpruceForm";
import { ProjectSettingsTabRoutes } from "constants/routes";

interface TabState
  extends Record<
    ProjectSettingsTabRoutes,
    { hasChanges: boolean; formData: FormDataProps }
  > {}

type Action =
  | {
      type: "updateForm";
      tab: ProjectSettingsTabRoutes;
      formData: FormDataProps;
    }
  | { type: "saveTab"; tab: ProjectSettingsTabRoutes };

const reducer = (state: TabState, action: Action): TabState => {
  switch (action.type) {
    case "saveTab":
      return state[action.tab].hasChanges
        ? {
            ...state,
            [action.tab]: {
              ...state[action.tab],
              hasChanges: false,
            },
          }
        : state;
    case "updateForm":
      return state[action.tab].formData === action.formData
        ? state
        : {
            ...state,
            [action.tab]: {
              formData: action.formData,
              hasChanges: true,
            },
          };
    default:
      throw new Error("Unknown action type");
  }
};

interface ProjectSettingsState {
  tabs: TabState;
  saveTab: (tab: ProjectSettingsTabRoutes) => void;
  getTabFormState: (tab: ProjectSettingsTabRoutes) => FormDataProps;
  updateForm: (
    tab: ProjectSettingsTabRoutes,
    formData: FormDataProps,
    save?: boolean
  ) => void;
}

const ProjectSettingsContext = createContext<ProjectSettingsState | null>(null);

const ProjectSettingsProvider: React.FC = ({ children }) => {
  const [state, dispatch] = useReducer(
    reducer,
    getDefaultRouteObject({
      hasChanges: false,
      formData: {},
    })
  );

  const updateForm = (
    tab: ProjectSettingsTabRoutes,
    formData: FormDataProps
  ): void => {
    dispatch({ type: "updateForm", tab, formData });
  };

  const saveTab = (tab: ProjectSettingsTabRoutes): void => {
    dispatch({ type: "saveTab", tab });
  };

  const getTabFormState = (tab: ProjectSettingsTabRoutes) =>
    state[tab].formData;

  return (
    <ProjectSettingsContext.Provider
      value={{
        updateForm,
        saveTab,
        getTabFormState,
        tabs: state,
      }}
    >
      {children}
    </ProjectSettingsContext.Provider>
  );
};

const useProjectSettingsContext = (): ProjectSettingsState => {
  const context = useContext(ProjectSettingsContext);
  if (context === undefined) {
    throw new Error(
      "useProjectSettingsContext must be used within a ProjectSettingsProvider"
    );
  }
  return context;
};

const usePopulateForm = (
  initialState: FormDataProps,
  tab: ProjectSettingsTabRoutes
): void => {
  const { saveTab, updateForm } = useProjectSettingsContext();
  const isSaved = useIsTabSaved(tab);

  useEffect(() => {
    // Ensure form does not have unsaved changes before writing.
    // This preserves the unsaved form state when switching between project settings tabs.
    if (isSaved) {
      updateForm(tab, initialState);
      saveTab(tab);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
};

const useIsTabSaved = (tab: ProjectSettingsTabRoutes): boolean => {
  const { tabs } = useProjectSettingsContext();
  return !tabs[tab].hasChanges;
};

const useIsAnyTabUnsaved = (): boolean => {
  const { tabs } = useProjectSettingsContext();
  return Object.values(tabs).some((tab) => tab.hasChanges);
};

const getDefaultRouteObject = <T extends unknown>(
  defaultValue: T
): Record<ProjectSettingsTabRoutes, T> =>
  Object.assign(
    {},
    ...Object.values(ProjectSettingsTabRoutes).map((route) => ({
      [route]: defaultValue,
    }))
  );

export {
  ProjectSettingsProvider,
  useIsAnyTabUnsaved,
  useIsTabSaved,
  usePopulateForm,
  useProjectSettingsContext,
};
