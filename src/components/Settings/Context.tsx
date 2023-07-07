/* import {
  createContext,
  Reducer,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from "react";
import debounce from "lodash.debounce";
import isEqual from "lodash.isequal";
import { SpruceFormProps } from "components/SpruceForm/types";
import { ProjectSettingsTabRoutes } from "constants/routes";
import { formToGqlMap } from "pages/projectSettings/tabs/transformers";
import {
  FormStateMap,
  FormToGqlFunction,
  TabDataProps,
  WritableTabRoutes,
} from "pages/projectSettings/tabs/types";

type SettingsRoutes = WritableTabRoutes;

type OnChangeParams<T extends SettingsRoutes> = Pick<
  Parameters<SpruceFormProps<FormStateMap[T]>["onChange"]>[0],
  "formData" | "errors"
>;

type TabState<T extends SettingsRoutes> = {
  [K in T]: {
    hasChanges: boolean;
    hasError: boolean;
    initialData: ReturnType<FormToGqlFunction<T>> | null;
    formData: FormStateMap[K] | null;
  };
};

type Action<T extends SettingsRoutes> =
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

const reducer = <T extends SettingsRoutes>(
  state: TabState<T>,
  action: Action<T>
): TabState<T> => {
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
      const formToGql: FormToGqlFunction<T> = formToGqlMap[action.tab];
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

interface ProjectSettingsState<T extends SettingsRoutes> {
  tabs: TabState<T>;
  saveTab: (tab: T) => void;
  getTab: (tab: T) => TabState<T>[T];
  updateForm: (tab: T) => (e: OnChangeParams<T>) => void;
  setInitialData: (tabData: TabDataProps) => void;
}

export const createSettingsContext = <T extends SettingsRoutes>() =>
  createContext<ProjectSettingsState<T> | null>(null);

const ProjectSettingsContext = createSettingsContext();

type ProviderProps<T> = {
  children: React.ReactNode;
  routes: T;
};

const SettingsProvider = <T extends SettingsRoutes>({
  children,
  routes,
}: ProviderProps<T>) => {
  const [state, dispatch] = useReducer(
    reducer,
    getDefaultTabState<T>(routes, {
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

  const updateForm =
    (tab: T) =>
    ({ formData, errors = [] }: OnChangeParams<T>) => {
      setHasChanges(tab, formData);
      dispatch({ type: "updateForm", tab, formData, errors });
    };

  const saveTab = (tab: T) => {
    dispatch({ type: "saveTab", tab });
  };

  const getTab = (tab: T) => state[tab];

  const setInitialData = useCallback((tabData: TabDataProps) => {
    dispatch({ type: "setInitialData", tabData });
  }, []);

  return (
    <ProjectSettingsContext.Provider
      // eslint-disable-next-line react/jsx-no-constructed-context-values
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

const useProjectSettingsContext = <
  T extends SettingsRoutes
>(): ProjectSettingsState<T> => {
  const context = useContext(ProjectSettingsContext);
  if (context === undefined) {
    throw new Error(
      "useProjectSettingsContext must be used within a ProjectSettingsProvider"
    );
  }
  return context;
};

const usePopulateForm = <T extends SettingsRoutes>(
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

const useHasUnsavedTab = (): {
  hasUnsaved: boolean;
  unsavedTabs: ProjectSettingsTabRoutes[];
} => {
  const { tabs } = useProjectSettingsContext();
  const unsavedTabs = useMemo(
    () =>
      Object.entries(tabs)
        .filter(([, tabData]) => tabData.hasChanges)
        .map(([tab]) => tab as ProjectSettingsTabRoutes),
    [tabs]
  );

  return {
    unsavedTabs,
    hasUnsaved: !!unsavedTabs.length,
  };
};

const getDefaultTabState = <T extends SettingsRoutes>(
  routes: T,
  defaultValue: TabState<T>[T]
): TabState<T> =>
  Object.assign(
    {},
    ...Object.values(routes).map((route: T) => ({
      [route]: defaultValue,
    }))
  );

export {
  SettingsProvider,
  useHasUnsavedTab,
  usePopulateForm,
  useProjectSettingsContext,
}; */
