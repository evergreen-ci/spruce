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
import { SpruceFormProps } from "components/SpruceForm";
import { ProjectSettingsTabRoutes } from "constants/routes";
import { formToGqlMap } from "./tabs/transformers";
import {
  FormStateMap,
  FormToGqlFunction,
  TabDataProps,
  WritableTabRoutes,
} from "./tabs/types";

type OnChangeParams<T extends WritableTabRoutes> = Pick<
  Parameters<SpruceFormProps<FormStateMap[T]>["onChange"]>[0],
  "formData" | "errors"
>;

type TabState = {
  [T in WritableTabRoutes]: {
    hasChanges: boolean;
    hasError: boolean;
    initialData: ReturnType<FormToGqlFunction<T>>;
    formData: FormStateMap[T];
  };
};

type Action<T extends WritableTabRoutes> =
  | {
      type: "updateForm";
      tab: T;
      formData: OnChangeParams<T>["formData"];
      errors: OnChangeParams<T>["errors"];
    }
  | { type: "saveTab"; tab: T }
  | {
      type: "setHasChanges";
      tab: T;
      formData: FormStateMap[T];
    }
  | {
      type: "setInitialData";
      tabData: TabDataProps;
    };

const reducer = <T extends WritableTabRoutes>(
  state: TabState,
  action: Action<T>
): TabState => {
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
    case "setHasChanges": {
      const formToGql: FormToGqlFunction<WritableTabRoutes> =
        formToGqlMap[action.tab];
      return {
        ...state,
        [action.tab]: {
          ...state[action.tab],
          hasChanges: !isEqual(
            state[action.tab].initialData,
            formToGql(action.formData)
          ),
        },
      };
    }
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
  saveTab: <T extends WritableTabRoutes>(tab: T) => void;
  getTab: <T extends WritableTabRoutes>(tab: T) => TabState[T];
  updateForm: <T extends WritableTabRoutes>(
    tab: T
  ) => (e: OnChangeParams<T>) => void;
  setInitialData: (tabData: TabDataProps) => void;
}

const ProjectSettingsContext = createContext<ProjectSettingsState | null>(null);

const ProjectSettingsProvider: React.VFC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(
    reducer,
    getDefaultTabState({
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
    tab: WritableTabRoutes
  ) => ({ formData, errors = [] }: OnChangeParams<WritableTabRoutes>) => {
    setHasChanges(tab, formData);
    dispatch({ type: "updateForm", tab, formData, errors });
  };

  const saveTab: ProjectSettingsState["saveTab"] = (tab: WritableTabRoutes) => {
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

const usePopulateForm = <T extends WritableTabRoutes>(
  formData: FormStateMap[T],
  tab: T
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

const getDefaultTabState = <T extends unknown>(
  defaultValue: T
): Record<WritableTabRoutes, T> =>
  Object.assign(
    {},
    ...Object.values(ProjectSettingsTabRoutes).map((route) => ({
      [route]: defaultValue,
    }))
  );

export { ProjectSettingsProvider, usePopulateForm, useProjectSettingsContext };
