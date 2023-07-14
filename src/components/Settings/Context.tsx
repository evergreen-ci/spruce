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
import { FormToGqlFunction, SettingsRoutes } from "./types";

type OnChangeParams<T extends SettingsRoutes, U extends Record<T, any>> = Pick<
  Parameters<SpruceFormProps<U[T]>["onChange"]>[0],
  "formData" | "errors"
>;

// TypeScript has a bug preventing the formData type mapping from working correctly.
// https://github.com/microsoft/TypeScript/issues/24085
// For now, leave as-is and assert form state types when errors are thrown.
export type TabState<T extends SettingsRoutes, U extends Record<T, any>> = {
  [K in T]: {
    hasChanges: boolean;
    hasError: boolean;
    initialData: ReturnType<FormToGqlFunction<K>>;
    formData: U[K];
  };
};

type Action<T extends SettingsRoutes, U extends Record<T, any>> =
  | {
      type: "updateForm";
      tab: T;
      formData: OnChangeParams<T, U>["formData"];
      errors: OnChangeParams<T, U>["errors"];
    }
  | { type: "saveTab"; tab: T }
  | {
      type: "setHasChanges";
      tab: T;
      formData: U[T];
    }
  | {
      type: "setInitialData";
      // TODO: Why won't T work instead of string?
      tabData: Record<string, TabState<T, U>[T]["formData"]>;
    };

const reducer =
  <T extends SettingsRoutes, U extends Record<T, any>>(
    getTransformer: Record<T, (...any) => any>
  ) =>
  (state: TabState<T, U>, action: Action<T, U>): TabState<T, U> => {
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
        const formToGql = getTransformer[action.tab];
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
              initialData: getTransformer[tab](data),
            },
          }),
          state
        );
      default:
        throw new Error("Unknown action type");
    }
  };

interface SettingsState<T extends SettingsRoutes, U extends Record<T, any>> {
  tabs: TabState<T, U>;
  saveTab: (tab: T) => void;
  getTab: (tab: T) => TabState<T, U>[T];
  updateForm: (tab: T) => (e: OnChangeParams<T, U>) => void;
  setInitialData: (tabData: Record<T, TabState<T, U>[T]["formData"]>) => void;
}

const createSettingsContext = <
  T extends SettingsRoutes,
  U extends Record<T, any>
>() => createContext<SettingsState<T, U> | null>(null);

const useSettingsState = <T extends SettingsRoutes, U extends Record<T, any>>(
  routes: T[],
  getTransformer: Record<T, (...any) => any>
): SettingsState<T, U> => {
  const [state, dispatch] = useReducer(
    reducer(getTransformer),
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

  const updateForm = ((tab) =>
    ({ formData, errors = [] }: OnChangeParams<T, U>) => {
      setHasChanges(tab, formData);
      dispatch({ type: "updateForm", tab, formData, errors });
    }) satisfies SettingsState<T, U>["updateForm"];

  const saveTab = ((tab) => {
    dispatch({ type: "saveTab", tab });
  }) satisfies SettingsState<T, U>["saveTab"];

  const getTab = ((tab) => state[tab]) satisfies SettingsState<T, U>["getTab"];

  const setInitialData = useCallback((tabData) => {
    dispatch({ type: "setInitialData", tabData });
  }, []) satisfies SettingsState<T, U>["setInitialData"];

  return {
    updateForm,
    saveTab,
    getTab,
    setInitialData,
    tabs: state,
  };
};

const populateForm = <T extends SettingsRoutes, U extends Record<T, any>>(
  context: Context<SettingsState<T, U>>
) =>
  function usePopulateForm(formData: U[T], tab: T): void {
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

const hasUnsavedTab = <T extends SettingsRoutes, U extends Record<T, any>>(
  context: Context<SettingsState<T, U>>
) =>
  function useHasUnsavedTab(): {
    hasUnsaved: boolean;
    unsavedTabs: T[];
  } {
    const { tabs } = useContext(context);
    const unsavedTabs = useMemo(
      () =>
        Object.entries(tabs)
          .filter(([, tabData]) => (tabData as TabState<T, U>[T]).hasChanges)
          .map(([tab]) => tab as T),
      [tabs]
    );

    return {
      unsavedTabs,
      hasUnsaved: !!unsavedTabs.length,
    };
  };

const getDefaultTabState = <T extends SettingsRoutes, U extends Record<T, any>>(
  routes: SettingsRoutes[],
  defaultValue: unknown
): TabState<T, U> =>
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
