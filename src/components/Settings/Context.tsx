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

type OnChangeParams<
  T extends SettingsRoutes,
  FormStateMap extends Record<T, any>,
> = Pick<
  Parameters<SpruceFormProps<FormStateMap[T]>["onChange"]>[0],
  "formData" | "errors"
>;

// TypeScript has a bug preventing the formData type mapping from working correctly.
// https://github.com/microsoft/TypeScript/issues/24085
// For now, leave as-is and assert form state types when errors are thrown.
export type TabState<
  T extends SettingsRoutes,
  FormStateMap extends Record<T, any>,
> = {
  [K in T]: {
    hasChanges: boolean;
    hasError: boolean;
    initialData: ReturnType<FormToGqlFunction<K>>;
    formData: FormStateMap[K];
  };
};

type Action<T extends SettingsRoutes, FormStateMap extends Record<T, any>> =
  | {
      type: "updateForm";
      tab: T;
      formData: OnChangeParams<T, FormStateMap>["formData"];
      errors: OnChangeParams<T, FormStateMap>["errors"];
    }
  | { type: "saveTab"; tab: T }
  | {
      type: "setHasChanges";
      tab: T;
      formData: FormStateMap[T];
    }
  | {
      type: "setInitialData";
      tabData: Record<T, TabState<T, FormStateMap>[T]["formData"]>;
    };

const reducer =
  <T extends SettingsRoutes, FormStateMap extends Record<T, any>>(
    getTransformer: Record<T, FormToGqlFunction<T>>,
  ) =>
  (
    state: TabState<T, FormStateMap>,
    action: Action<T, FormStateMap>,
  ): TabState<T, FormStateMap> => {
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
              formToGql(action.formData),
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
          state,
        );
      default:
        throw new Error("Unknown action type");
    }
  };

interface SettingsState<
  T extends SettingsRoutes,
  FormStateMap extends Record<T, any>,
> {
  tabs: TabState<T, FormStateMap>;
  saveTab: (tab: T) => void;
  getTab: (tab: T) => TabState<T, FormStateMap>[T];
  updateForm: (tab: T) => (e: OnChangeParams<T, FormStateMap>) => void;
  setInitialData: (
    tabData: Record<T, TabState<T, FormStateMap>[T]["formData"]>,
  ) => void;
}

const createSettingsContext = <
  T extends SettingsRoutes,
  FormStateMap extends Record<T, any>,
>() => createContext<SettingsState<T, FormStateMap> | null>(null);

const useSettingsState = <
  T extends SettingsRoutes,
  FormStateMap extends Record<T, any>,
>(
  routes: T[],
  getTransformer: Record<T, (...any) => any>,
): SettingsState<T, FormStateMap> => {
  const [state, dispatch] = useReducer(
    reducer(getTransformer),
    getDefaultTabState(routes, {
      hasChanges: false,
      hasError: false,
      initialData: null,
      formData: null,
    }),
  );

  const setHasChanges = useMemo(
    () =>
      debounce((tab, formData) => {
        dispatch({ type: "setHasChanges", tab, formData });
      }, 400),
    [],
  );

  const updateForm = ((tab) =>
    ({ errors = [], formData }: OnChangeParams<T, FormStateMap>) => {
      setHasChanges(tab, formData);
      dispatch({ type: "updateForm", tab, formData, errors });
    }) satisfies SettingsState<T, FormStateMap>["updateForm"];

  const saveTab = ((tab) => {
    dispatch({ type: "saveTab", tab });
  }) satisfies SettingsState<T, FormStateMap>["saveTab"];

  const getTab = ((tab) => state[tab]) satisfies SettingsState<
    T,
    FormStateMap
  >["getTab"];

  const setInitialData = useCallback((tabData) => {
    dispatch({ type: "setInitialData", tabData });
  }, []) satisfies SettingsState<T, FormStateMap>["setInitialData"];

  return {
    updateForm,
    saveTab,
    getTab,
    setInitialData,
    tabs: state,
  };
};

const getUsePopulateForm = <
  T extends SettingsRoutes,
  FormStateMap extends Record<T, any>,
>(
  context: Context<SettingsState<T, FormStateMap>>,
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

const getUseHasUnsavedTab = <
  T extends SettingsRoutes,
  FormStateMap extends Record<T, any>,
>(
  context: Context<SettingsState<T, FormStateMap>>,
) =>
  function useHasUnsavedTab(): {
    hasUnsaved: boolean;
    unsavedTabs: T[];
  } {
    const { tabs } = useContext(context);
    const unsavedTabs = useMemo(
      () =>
        Object.entries(tabs)
          .filter(
            ([, tabData]) =>
              (tabData as TabState<T, FormStateMap>[T]).hasChanges,
          )
          .map(([tab]) => tab as T),
      [tabs],
    );

    return {
      unsavedTabs,
      hasUnsaved: !!unsavedTabs.length,
    };
  };

const getDefaultTabState = <
  T extends SettingsRoutes,
  FormStateMap extends Record<T, any>,
>(
  routes: T[],
  defaultValue: TabState<T, FormStateMap>[T],
): TabState<T, FormStateMap> =>
  Object.assign(
    {},
    ...routes.map((route) => ({
      [route]: defaultValue,
    })),
  );

export {
  createSettingsContext,
  getDefaultTabState,
  getUsePopulateForm,
  getUseHasUnsavedTab,
  useSettingsState,
};
export type { SettingsState };
