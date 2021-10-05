import { createContext, useContext, useEffect, useReducer } from "react";
import { FormProps } from "@rjsf/core";
import { ProjectSettingsTabRoutes } from "constants/routes";

interface ProjectSettingsState
  extends Record<ProjectSettingsTabRoutes, boolean> {}

type SaveAction =
  | { type: "saveTab"; tab: ProjectSettingsTabRoutes }
  | { type: "unsaveTab"; tab: ProjectSettingsTabRoutes };

interface SaveTabDispatchState {
  saveTab: (tab: ProjectSettingsTabRoutes) => void;
  unsaveTab: (tab: ProjectSettingsTabRoutes) => void;
}

const saveReducer = (
  state: ProjectSettingsState,
  action: SaveAction
): ProjectSettingsState => {
  switch (action.type) {
    case "saveTab":
      return state[action.tab] ? state : { ...state, [action.tab]: true };
    case "unsaveTab":
      return !state[action.tab] ? state : { ...state, [action.tab]: false };
    default:
      return state;
  }
};

type FormAction = {
  type: "updateForm";
  tab: ProjectSettingsTabRoutes;
  formData: FormProps<any>["formData"];
};

interface FormState
  extends Record<ProjectSettingsTabRoutes, FormProps<any>["formData"]> {}

interface FormContextState {
  formState: FormState;
  setFormState: (
    tab: ProjectSettingsTabRoutes,
    formData: FormProps<any>["formData"],
    save?: boolean
  ) => void;
}

const formReducer = (state: FormState, action: FormAction): FormState => {
  switch (action.type) {
    case "updateForm":
      return {
        ...state,
        [action.tab]: action.formData,
      };
    default:
      return state;
  }
};

const ProjectSettingsContext = createContext<ProjectSettingsState | null>(null);
const SaveTabDispatchContext = createContext<SaveTabDispatchState | null>(null);
const FormContext = createContext<FormContextState | null>(null);

const ProjectSettingsProvider: React.FC = ({ children }) => {
  const [savedTabState, dispatchSaveTab] = useReducer(
    saveReducer,
    getDefaultRouteObject(true)
  );

  const [formState, dispatchForm] = useReducer(
    formReducer,
    getDefaultRouteObject({})
  );

  const dispatchSaveTabContext = {
    saveTab: (tab) => {
      dispatchSaveTab({ type: "saveTab", tab });
    },
    unsaveTab: (tab) => {
      dispatchSaveTab({ type: "unsaveTab", tab });
    },
  };

  const setFormState = (tab, formData, unsave = true) => {
    if (unsave) {
      dispatchSaveTabContext.unsaveTab(tab);
    }
    dispatchForm({ type: "updateForm", tab, formData });
  };

  return (
    <ProjectSettingsContext.Provider value={savedTabState}>
      <SaveTabDispatchContext.Provider value={dispatchSaveTabContext}>
        <FormContext.Provider value={{ formState, setFormState }}>
          {children}
        </FormContext.Provider>
      </SaveTabDispatchContext.Provider>
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
const useSaveTabDispatchContext = (): SaveTabDispatchState => {
  const context = useContext(SaveTabDispatchContext);
  if (context === undefined) {
    throw new Error(
      "useSaveTabDispatchContext must be used within a ProjectSettingsProvider"
    );
  }
  return context;
};

const useFormContext = (): FormContextState => {
  const context = useContext(FormContext);
  if (context === undefined) {
    throw new Error(
      "useFormContext must be used within a ProjectSettingsProvider"
    );
  }
  return context;
};

const usePopulateForm = (
  initialState: any,
  tab: ProjectSettingsTabRoutes
): void => {
  const { setFormState } = useFormContext();
  const isSaved = useIsTabSaved(tab);

  useEffect(() => {
    // Ensure form does not have unsaved changes before writing.
    // This preserves the unsaved form state when switching between project settings tabs.
    if (isSaved) {
      setFormState(tab, initialState, false);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
};

const useIsTabSaved = (tab: ProjectSettingsTabRoutes): boolean => {
  const tabStates = useProjectSettingsContext();
  return tabStates[tab];
};

const useIsAnyTabUnsaved = (): boolean => {
  const tabStates = useProjectSettingsContext();
  return !Object.values(tabStates).every((tab) => tab);
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
  useFormContext,
  useIsAnyTabUnsaved,
  useIsTabSaved,
  usePopulateForm,
  useSaveTabDispatchContext,
};
