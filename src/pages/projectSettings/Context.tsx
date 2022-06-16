import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from "react";
import debounce from "lodash.debounce";
import isEqual from "lodash.isequal";
import { FormDataProps, SpruceFormProps } from "components/SpruceForm";
import { ProjectSettingsTabRoutes } from "constants/routes";
import { formToGqlMap } from "pages/projectSettings/tabs/transformers";
import {
  FormToGqlFunction,
  TabDataProps,
} from "pages/projectSettings/tabs/types";

type OnChangeParams = Pick<
  Parameters<SpruceFormProps["onChange"]>[0],
  "formData" | "errors"
>;

type TabState = Record<
  ProjectSettingsTabRoutes,
  {
    hasChanges: boolean;
    hasError: boolean;
    initialData: ReturnType<FormToGqlFunction>;
    formData: FormDataProps;
  }
>;

type Action =
  | {
      type: "updateForm";
      tab: ProjectSettingsTabRoutes;
      formData: OnChangeParams["formData"];
      errors: OnChangeParams["errors"];
    }
  | { type: "saveTab"; tab: ProjectSettingsTabRoutes }
  | {
      type: "setHasChanges";
      tab: ProjectSettingsTabRoutes;
      formData: FormDataProps;
    }
  | {
      type: "setInitialData";
      tabData: TabDataProps;
    };

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
      return {
        ...state,
        [action.tab]: {
          ...state[action.tab],
          formData: action.formData,
          hasError: !!action.errors.length,
        },
      };
    case "setHasChanges":
      return {
        ...state,
        [action.tab]: {
          ...state[action.tab],
          hasChanges: !isEqual(
            state[action.tab].initialData,
            formToGqlMap[action.tab](action.formData)
          ),
        },
      };
    case "setInitialData":
      return Object.entries(action.tabData).reduce(
        (s, [tab, data]) => ({
          ...s,
          [tab]: {
            ...s[tab],
            initialData: formToGqlMap[tab](data.projectData ?? data.repoData),
          },
        }),
        state
      );
    default:
      throw new Error("Unknown action type");
  }
};

interface ProjectSettingsState {
  tabs: TabState;
  saveTab: (tab: ProjectSettingsTabRoutes) => void;
  getTab: (tab: ProjectSettingsTabRoutes) => FormDataProps;
  updateForm: (tab: ProjectSettingsTabRoutes) => (e: OnChangeParams) => void;
  setInitialData: (tabData: TabDataProps) => void;
}

const ProjectSettingsContext = createContext<ProjectSettingsState | null>(null);

const ProjectSettingsProvider: React.VFC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(
    reducer,
    getDefaultRouteObject({
      hasChanges: false,
      hasError: false,
      initialData: null,
      formData: null,
    })
  );

  const setHasChanges = useMemo(
    () =>
      debounce((tab, formData) => {
        dispatch({ type: "setHasChanges", tab, formData });
      }, 400),
    []
  );

  const updateForm: ProjectSettingsState["updateForm"] = (
    tab: ProjectSettingsTabRoutes
  ) => ({ formData, errors = [] }: OnChangeParams) => {
    setHasChanges(tab, formData);
    dispatch({ type: "updateForm", tab, formData, errors });
  };

  const saveTab: ProjectSettingsState["saveTab"] = (
    tab: ProjectSettingsTabRoutes
  ) => {
    dispatch({ type: "saveTab", tab });
  };

  const getTab: ProjectSettingsState["getTab"] = (
    tab: ProjectSettingsTabRoutes
  ) => state[tab];

  const setInitialData: ProjectSettingsState["setInitialData"] = useCallback(
    (tabData: TabDataProps) => {
      dispatch({ type: "setInitialData", tabData });
    },
    []
  );

  return (
    <ProjectSettingsContext.Provider
      value={{
        updateForm,
        saveTab,
        getTab,
        setInitialData,
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
  const { getTab, saveTab, updateForm } = useProjectSettingsContext();
  const { hasChanges } = getTab(tab);

  useEffect(() => {
    // Ensure form does not have unsaved changes before writing.
    // This preserves the unsaved form state when switching between project settings tabs.
    if (!hasChanges) {
      updateForm(tab)({ formData, errors: [] });
      saveTab(tab);
    }
  }, [formData]); // eslint-disable-line react-hooks/exhaustive-deps
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

export { ProjectSettingsProvider, usePopulateForm, useProjectSettingsContext };
