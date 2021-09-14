import { useEffect, useReducer } from "react";
import { useHistory, useLocation, useParams } from "react-router-dom";
import { getPatchRoute } from "constants/routes";
import {
  ConfigurePatchQuery,
  ParameterInput,
  PatchTriggerAlias,
  VariantTask,
} from "gql/generated/types";
import { PatchTab } from "types/patch";
import { array, queryString, string } from "utils";

const { convertArrayToObject, mapStringArrayToObject } = array;
const { parseQueryString } = queryString;
const { omitTypename } = string;

type ConfigurePatchState = {
  description: string;
  selectedAliases: AliasState;
  selectedBuildVariants: string[];
  selectedBuildVariantTasks: VariantTasksState;
  patchParams: ParameterInput[];
  selectedTab: number;
  disableBuildVariantSelect: boolean;
};

type Action =
  | { type: "setDescription"; description: string }
  | { type: "setSelectedBuildVariants"; buildVariants: string[] }
  | { type: "setPatchParams"; params: ParameterInput[] }
  | { type: "setSelectedBuildVariantTasks"; variantTasks: VariantTasksState }
  | { type: "setSelectedTab"; tabIndex: number }
  | {
      type: "updatePatchData";
      description: string;
      buildVariants: string[];
      params: ParameterInput[];
      variantTasks: VariantTasksState;
      aliases: AliasState;
    }
  | {
      type: "setSelectedAliases";
      aliases: AliasState;
    };

const initialState = ({ selectedTab = 0 }: { selectedTab: number }) => ({
  description: "",
  selectedAliases: {},
  selectedBuildVariants: [],
  selectedBuildVariantTasks: {},
  patchParams: null,
  selectedTab,
  disableBuildVariantSelect: tabToIndexMap[selectedTab] === PatchTab.Tasks,
});

const reducer = (state: ConfigurePatchState, action: Action) => {
  switch (action.type) {
    case "setDescription":
      return {
        ...state,
        description: action.description,
      };
    case "setSelectedBuildVariants":
      return {
        ...state,
        selectedBuildVariants: action.buildVariants,
      };
    case "setSelectedBuildVariantTasks":
      return {
        ...state,
        selectedBuildVariantTasks: action.variantTasks,
      };
    case "setSelectedAliases":
      return {
        ...state,
        selectedAliases: action.aliases,
      };
    case "setPatchParams":
      return {
        ...state,
        patchParams: omitTypename(action.params),
      };
    case "setSelectedTab": {
      let tab = indexToTabMap.indexOf(PatchTab.Tasks);
      if (action.tabIndex !== -1 && action.tabIndex < indexToTabMap.length) {
        tab = action.tabIndex;
      }
      return {
        ...state,
        selectedTab: tab,
        disableBuildVariantSelect:
          indexToTabMap[action.tabIndex] !== PatchTab.Tasks,
      };
    }
    case "updatePatchData":
      return {
        ...state,
        description: action.description,
        selectedBuildVariants: action.buildVariants,
        patchParams: omitTypename(action.params),
        selectedBuildVariantTasks: action.variantTasks,
        selectedAliases: action.aliases,
      };

    default:
      throw new Error();
  }
};

const indexToTabMap = [PatchTab.Tasks, PatchTab.Changes, PatchTab.Parameters];

const tabToIndexMap = {
  [PatchTab.Tasks]: 0,
  [PatchTab.Changes]: 1,
  [PatchTab.Parameters]: 2,
};

export type AliasState = {
  [alias: string]: boolean;
};
export type TasksState = {
  [task: string]: boolean;
};
export type VariantTasksState = {
  [variant: string]: TasksState;
};

interface HookResult extends ConfigurePatchState {
  setDescription: (description: string) => void;
  setPatchParams: (patchParams: ParameterInput[]) => void;
  setSelectedBuildVariants: (variants: string[]) => void;
  setSelectedBuildVariantTasks: (variantTasks: VariantTasksState) => void;
  setSelectedAliases: (aliases: AliasState) => void;
  setSelectedTab: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const useConfigurePatch = (
  patch: ConfigurePatchQuery["patch"],
  variants: ConfigurePatchQuery["patch"]["project"]["variants"]
): HookResult => {
  const history = useHistory();
  const location = useLocation();
  const { tab } = useParams<{ tab: PatchTab | null }>();

  const { id } = patch;

  const [state, dispatch] = useReducer(
    reducer,
    initialState({
      selectedTab: tabToIndexMap[tab || PatchTab.Configure],
    })
  );

  const { selectedTab } = state;

  useEffect(() => {
    const query = parseQueryString(location.search);
    history.replace(
      getPatchRoute(id, {
        configure: true,
        tab: indexToTabMap[selectedTab],
        ...query,
      })
    );
  }, [selectedTab]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (patch) {
      dispatch({
        type: "updatePatchData",
        description: patch.description,
        buildVariants: [variants[0]?.name],
        params: patch.parameters,
        variantTasks: initializeTaskState(variants, patch.variantsTasks),
        aliases: initializeAliasState(patch.patchTriggerAliases),
      });
    }
  }, [patch, variants]);

  const setDescription = (description) =>
    dispatch({ type: "setDescription", description });
  const setSelectedBuildVariants = (buildVariants: string[]) =>
    dispatch({ type: "setSelectedBuildVariants", buildVariants });
  const setSelectedBuildVariantTasks = (variantTasks) =>
    dispatch({
      type: "setSelectedBuildVariantTasks",
      variantTasks,
    });
  const setSelectedAliases = (aliases: AliasState) =>
    dispatch({
      type: "setSelectedAliases",
      aliases,
    });
  const setSelectedTab = (i) =>
    dispatch({ type: "setSelectedTab", tabIndex: i });
  const setPatchParams = (params) =>
    dispatch({ type: "setPatchParams", params });

  return {
    ...state,
    setDescription,
    setPatchParams,
    setSelectedAliases,
    setSelectedBuildVariants,
    setSelectedBuildVariantTasks,
    setSelectedTab,
  };
};

// Takes in variant tasks and default selected tasks and returns an object
// With merged variant and default selected tasks auto selected.
const initializeTaskState = (
  variantTasks: VariantTask[],
  defaultSelectedTasks: VariantTask[]
) => {
  const defaultTasks = convertArrayToObject(defaultSelectedTasks, "name");
  return variantTasks.reduce(
    (prev, { name: variant, tasks }) => ({
      ...prev,
      [variant]: {
        ...mapStringArrayToObject(tasks, false),
        ...(defaultTasks[variant]
          ? mapStringArrayToObject(defaultTasks[variant].tasks, true)
          : {}),
      },
    }),
    {}
  );
};

const initializeAliasState = (patchTriggerAliases: PatchTriggerAlias[]) =>
  patchTriggerAliases.reduce(
    (prev, { alias }) => ({
      ...prev,
      [alias]: false,
    }),
    {}
  );
