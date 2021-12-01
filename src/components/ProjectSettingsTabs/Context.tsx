import { createContext, useContext, useEffect, useReducer } from "react";
import { FormStateMap } from "components/ProjectSettingsTabs/types";
import { FormDataProps, SpruceFormProps } from "components/SpruceForm";
import { ProjectSettingsTabRoutes } from "constants/routes";

type TabState = {
  [K in keyof FormStateMap]: {
    hasChanges: boolean;
    hasError: boolean;
    formData: FormStateMap[K];
  };
};

type Action =
  | {
      type: "updateForm";
      tab: ProjectSettingsTabRoutes;
      formData: FormDataProps;
      errors: Parameters<SpruceFormProps["onChange"]>[0]["errors"];
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
              hasError: false,
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
              hasError: !!action.errors.length,
            },
          };
    default:
      throw new Error("Unknown action type");
  }
};

interface ProjectSettingsState {
  tabs: TabState;
  saveTab: (tab: ProjectSettingsTabRoutes) => void;
  getTab: (
    tab: ProjectSettingsTabRoutes
  ) => TabState[ProjectSettingsTabRoutes.General]; // TODO: update type as all tabs are implemented
  updateForm: (
    tab: ProjectSettingsTabRoutes,
    save?: boolean
  ) => (formData: FormDataProps) => void;
}

const ProjectSettingsContext = createContext<ProjectSettingsState | null>(null);

const ProjectSettingsProvider: React.FC = ({ children }) => {
  const [state, dispatch] = useReducer(
    reducer,
    getDefaultRouteObject({
      hasChanges: false,
      hasError: false,
      formData: null,
    })
  );

  const updateForm = (tab: ProjectSettingsTabRoutes) => ({
    formData,
    errors = [],
  }: Parameters<SpruceFormProps["onChange"]>[0]): void => {
    dispatch({ type: "updateForm", tab, formData, errors });
  };

  const saveTab = (tab: ProjectSettingsTabRoutes): void => {
    dispatch({ type: "saveTab", tab });
  };

  const getTab = (tab: ProjectSettingsTabRoutes) => state[tab];

  return (
    <ProjectSettingsContext.Provider
      value={{
        updateForm,
        saveTab,
        getTab,
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
  formData: FormDataProps,
  tab: ProjectSettingsTabRoutes
): void => {
  const { saveTab, updateForm } = useProjectSettingsContext();
  const isSaved = useIsTabSaved(tab);

  useEffect(() => {
    // Ensure form does not have unsaved changes before writing.
    // This preserves the unsaved form state when switching between project settings tabs.
    if (isSaved) {
      updateForm(tab)({ formData });
      saveTab(tab);
    }
  }, [formData]); // eslint-disable-line react-hooks/exhaustive-deps
};

const useIsTabSaved = (tab: ProjectSettingsTabRoutes): boolean => {
  const { tabs } = useProjectSettingsContext();
  return !tabs[tab].hasChanges;
};

const useIsAnyTabUnsaved = (): {
  hasUnsaved: boolean;
  unsavedTabs: ProjectSettingsTabRoutes[];
} => {
  const { tabs } = useProjectSettingsContext();
  const unsavedTabs = Object.entries(tabs)
    .filter(([, tabData]) => tabData.hasChanges)
    .map(([tab]) => tab as ProjectSettingsTabRoutes);

  return {
    unsavedTabs,
    hasUnsaved: !!unsavedTabs.length,
  };
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
