import {
  Context,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from "react";
import debounce from "lodash.debounce";
import isEqual from "lodash.isequal";
import { SpruceFormProps } from "components/SpruceForm/types";
import { formToGqlMap } from "pages/projectSettings/tabs/transformers";

import {
  FormStateMap,
  FormToGqlFunction,
  TabDataProps,
} from "pages/projectSettings/tabs/types";
import { SettingsRoutes } from "./types";

type OnChangeParams<T extends SettingsRoutes> = Pick<
  Parameters<SpruceFormProps<FormStateMap[T]>["onChange"]>[0],
  "formData" | "errors"
>;

// TypeScript has a bug preventing the formData type mapping from working correctly!
// https://github.com/microsoft/TypeScript/issues/24085
// For now, leave as-is and assert form state types when errors are thrown.
export type TabState<
  T extends SettingsRoutes,
  U extends Record<T, any> = FormStateMap
> = {
  [K in T]: {
    hasChanges: boolean;
    hasError: boolean;
    initialData: ReturnType<FormToGqlFunction<K>>;
    formData: U[K];
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
      const formToGql: FormToGqlFunction<SettingsRoutes> =
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

interface SettingsState<T extends SettingsRoutes> {
  tabs: TabState<T>;
  saveTab: (tab: T) => void;
  getTab: (tab: T) => TabState<T>[T];
  updateForm: (tab: T) => (e: OnChangeParams<T>) => void;
  setInitialData: (tabData: TabDataProps) => void;
}

const createSettingsContext = <T extends SettingsRoutes>() =>
  createContext<SettingsState<T> | null>(null);

const useSettingsState = <T extends SettingsRoutes>(
  routes: T[]
): SettingsState<T> => {
  const [state, dispatch] = useReducer(
    reducer,
    getDefaultTabState(routes, {
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

  return {
    updateForm,
    saveTab,
    getTab,
    setInitialData,
    tabs: state,
  };
};
const populateForm = <T extends SettingsRoutes>(
  context: Context<SettingsState<T>>
) =>
  function usePopulateForm(formData: FormStateMap[T], tab: T): void {
    const { getTab, saveTab, updateForm } = useContext(context);
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

const hasUnsavedTab = <T extends SettingsRoutes>(
  context: Context<SettingsState<T>>
) =>
  function useHasUnsavedTab(): {
    hasUnsaved: boolean;
    unsavedTabs: T[];
  } {
    const { tabs } = useContext(context);
    const unsavedTabs = useMemo(
      () =>
        Object.entries(tabs)
          .filter(([, tabData]) => (tabData as TabState<T>[T]).hasChanges)
          .map(([tab]) => tab as T),
      [tabs]
    );

    return {
      unsavedTabs,
      hasUnsaved: !!unsavedTabs.length,
    };
  };

const getDefaultTabState = <T extends SettingsRoutes, U extends unknown>(
  routes: SettingsRoutes[],
  defaultValue: U
): Record<T, U> =>
  Object.assign(
    {},
    ...Object.values(routes).map((route) => ({
      [route]: defaultValue,
    }))
  );

export {
  createSettingsContext,
  getDefaultTabState,
  hasUnsavedTab,
  populateForm,
  useSettingsState,
};
export type { SettingsState };
