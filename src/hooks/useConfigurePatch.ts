import { useEffect, useReducer } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { getPatchRoute } from "constants/routes";
import {
  ConfigurePatchQuery,
  ParameterInput,
  VariantTask,
} from "gql/generated/types";
import { PatchTab } from "types/patch";
import { Unpacked } from "types/utils";
import { array, queryString, string } from "utils";
import { useTabShortcut } from "./useTabShortcut";

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
  disableBuildVariantSelect: tabToIndexMap[selectedTab] === PatchTab.Tasks,
  patchParams: null,
  selectedAliases: {},
  selectedBuildVariantTasks: {},
  selectedBuildVariants: [],
  selectedTab,
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
        selectedBuildVariants: action.buildVariants.sort((a, b) =>
          b.localeCompare(a)
        ),
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
        disableBuildVariantSelect:
          indexToTabMap[action.tabIndex] !== PatchTab.Tasks,
        selectedTab: tab,
      };
    }
    case "updatePatchData":
      return {
        ...state,
        description: action.description,
        patchParams: omitTypename(action.params),
        selectedAliases: action.aliases,
        selectedBuildVariantTasks: action.variantTasks,
        selectedBuildVariants: action.buildVariants,
      };

    default:
      throw new Error("Unknown action type");
  }
};

const indexToTabMap = [PatchTab.Tasks, PatchTab.Changes, PatchTab.Parameters];

const tabToIndexMap = {
  [PatchTab.Tasks]: 0,
  [PatchTab.Changes]: 1,
  [PatchTab.Parameters]: 2,
};

// Extract the type of a child patch and append alias field
export interface ChildPatchAliased
  extends Unpacked<ConfigurePatchQuery["patch"]["childPatches"]> {
  alias: string;
}

export type PatchTriggerAlias = Unpacked<
  ConfigurePatchQuery["patch"]["patchTriggerAliases"]
>;

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
  setSelectedTab: React.Dispatch<React.SetStateAction<number>>;
}

export const useConfigurePatch = (
  patch: ConfigurePatchQuery["patch"]
): HookResult => {
  const navigate = useNavigate();
  const location = useLocation();
  const { tab } = useParams<{ tab: PatchTab | null }>();

  const { id, project } = patch;
  const { variants } = project;
  const [state, dispatch] = useReducer(
    reducer,
    initialState({
      selectedTab: tabToIndexMap[tab || PatchTab.Configure],
    })
  );

  const { selectedTab } = state;

  useEffect(() => {
    const query = parseQueryString(location.search);
    navigate(
      getPatchRoute(id, {
        configure: true,
        tab: indexToTabMap[selectedTab],
        ...query,
      }),
      { replace: true }
    );
  }, [selectedTab]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (patch) {
      dispatch({
        aliases: initializeAliasState(patch.patchTriggerAliases),
        buildVariants: [variants[0]?.name],
        description: patch.description,
        params: patch.parameters,
        type: "updatePatchData",
        variantTasks: initializeTaskState(variants, patch.variantsTasks),
      });
    }
  }, [patch, variants]);

  const setDescription = (description: string) =>
    dispatch({ description, type: "setDescription" });
  const setSelectedBuildVariants = (buildVariants: string[]) =>
    dispatch({ buildVariants, type: "setSelectedBuildVariants" });
  const setSelectedBuildVariantTasks = (variantTasks: VariantTasksState) =>
    dispatch({
      type: "setSelectedBuildVariantTasks",
      variantTasks,
    });
  const setSelectedAliases = (aliases: AliasState) =>
    dispatch({
      aliases,
      type: "setSelectedAliases",
    });
  const setSelectedTab = (i: number) =>
    dispatch({ tabIndex: i, type: "setSelectedTab" });
  const setPatchParams = (params: ParameterInput[]) =>
    dispatch({ params, type: "setPatchParams" });

  useTabShortcut({
    currentTab: selectedTab,
    numTabs: indexToTabMap.length,
    setSelectedTab,
  });

  return {
    ...state,
    setDescription,
    setPatchParams,
    setSelectedAliases,
    setSelectedBuildVariantTasks,
    setSelectedBuildVariants,
    setSelectedTab,
  };
};

// Takes in variant tasks and default selected tasks and returns an object
// With merged variant and default selected tasks auto selected.
const initializeTaskState = (
  variantTasks: ConfigurePatchQuery["patch"]["project"]["variants"],
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
