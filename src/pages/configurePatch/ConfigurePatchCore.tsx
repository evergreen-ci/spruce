import React, { useEffect, useReducer } from "react";
import { useMutation } from "@apollo/client";
import styled from "@emotion/styled";
import { Tab } from "@leafygreen-ui/tabs";
import { Body } from "@leafygreen-ui/typography";
import { Input } from "antd";
import { useHistory, useLocation, useParams } from "react-router-dom";
import { MetadataCard } from "components/MetadataCard";
import { CodeChanges } from "components/PatchTabs/CodeChanges";
import { ParametersContent } from "components/PatchTabs/ParametersContent";
import { PageContent, PageLayout, PageSider } from "components/styles";
import { StyledTabs } from "components/styles/StyledTabs";
import { P2 } from "components/Typography";
import { getPatchRoute, getVersionRoute } from "constants/routes";
import { useToastContext } from "context/toast";
import {
  SchedulePatchMutation,
  PatchConfigure,
  SchedulePatchMutationVariables,
  VariantTasks,
  ConfigurePatchQuery,
  VariantTask,
  ParameterInput,
  PatchTriggerAlias,
} from "gql/generated/types";
import { SCHEDULE_PATCH } from "gql/mutations";
import { PatchTab } from "types/patch";
import { queryString, string } from "utils";
import { convertArrayToObject, mapStringArrayToObject } from "utils/array";
import { ConfigureBuildVariants } from "./configurePatchCore/ConfigureBuildVariants";
import { ConfigureTasks } from "./configurePatchCore/ConfigureTasks";
import {
  DownstreamPatchState,
  VariantTasksState,
} from "./configurePatchCore/state";

const { omitTypename } = string;
const { parseQueryString } = queryString;

type configurePatchState = {
  description: string;
  selectedBuildVariants: string[];
  selectedBuildVariantTasks: VariantTasksState;
  patchParams: ParameterInput[];
  selectedTab: number;
  disableBuildVariantSelect: boolean;
  selectedDownstreamPatches: DownstreamPatchState;
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
      patches: DownstreamPatchState;
    }
  | { type: "setSelectedDownstreamPatches"; patches: DownstreamPatchState };

const initialState = ({ selectedTab = 0 }: { selectedTab: number }) => ({
  description: "",
  selectedBuildVariants: [],
  selectedBuildVariantTasks: {},
  patchParams: null,
  selectedTab,
  disableBuildVariantSelect: tabToIndexMap[selectedTab] === PatchTab.Tasks,
  selectedDownstreamPatches: {},
});
const reducer = (state: configurePatchState, action: Action) => {
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
    case "setSelectedDownstreamPatches":
      return {
        ...state,
        selectedDownstreamPatches: action.patches,
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
        selectedDownstreamPatches: action.patches,
      };

    default:
      throw new Error();
  }
};

interface Props {
  patch: ConfigurePatchQuery["patch"];
}
export const ConfigurePatchCore: React.FC<Props> = ({ patch }) => {
  const dispatchToast = useToastContext();
  const history = useHistory();
  const location = useLocation();
  const { tab } = useParams<{ tab: PatchTab | null }>();

  const [state, dispatch] = useReducer(
    reducer,
    initialState({
      selectedTab: tabToIndexMap[tab || PatchTab.Configure],
    })
  );

  const { project, id, author, time, activated, patchTriggerAliases } = patch;
  const { variants } = project;

  const [schedulePatch, { loading: loadingScheduledPatch }] = useMutation<
    SchedulePatchMutation,
    SchedulePatchMutationVariables
  >(SCHEDULE_PATCH, {
    onCompleted(data) {
      const { schedulePatch: scheduledPatch } = data;
      dispatchToast.success("Successfully scheduled the patch");
      history.push(getVersionRoute(scheduledPatch.id));
    },
    onError(err) {
      dispatchToast.error(
        `There was an error scheduling this patch : ${err.message}`
      );
    },
  });

  const {
    description,
    selectedBuildVariants,
    selectedBuildVariantTasks,
    patchParams,
    selectedTab,
    disableBuildVariantSelect,
    selectedDownstreamPatches,
  } = state;

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
        patches: initializeDownstreamPatchState(patch.patchTriggerAliases),
      });
    }
  }, [patch, variants]);

  const onClickSchedule = async (): Promise<void> => {
    const configurePatchParam: PatchConfigure = {
      description: state.description,
      variantsTasks: getGqlVariantTasksParamFromState(
        selectedBuildVariantTasks
      ),
      parameters: patchParams,
      patchTriggerAliases: getGqlDownstreamPatchesFromState(
        selectedDownstreamPatches
      ),
    };
    schedulePatch({
      variables: { patchId: id, configure: configurePatchParam },
    });
  };

  if (variants.length === 0) {
    return (
      // TODO: Full page error
      <PageLayout>
        <div data-cy="full-page-error">
          Something went wrong. This patch&apos;s project either has no variants
          or no tasks associated with it.{" "}
        </div>
      </PageLayout>
    );
  }

  return (
    <>
      <StyledBody weight="medium">Patch Name</StyledBody>
      <StyledInput
        data-cy="patch-name-input"
        value={description}
        size="large"
        onChange={(e) =>
          dispatch({ type: "setDescription", description: e.target.value })
        }
      />
      <PageLayout>
        <PageSider>
          <MetadataCard error={null} title="Patch Metadata">
            <P2>Submitted by: {author}</P2>
            <P2>Submitted at: {time.submittedAt}</P2>
          </MetadataCard>
          <ConfigureBuildVariants
            variants={variants.map(({ displayName, name }) => ({
              displayName,
              name,
              taskCount: selectedBuildVariantTasks[name]
                ? Object.values(selectedBuildVariantTasks[name]).filter(
                    (v) => v
                  ).length
                : 0,
            }))}
            aliases={patchTriggerAliases.map(({ alias, childProject }) => ({
              displayName: `${alias} (${childProject})`,
              name: alias,
              taskCount: selectedDownstreamPatches[alias] ? 1 : 0,
            }))}
            selectedBuildVariants={selectedBuildVariants}
            setSelectedBuildVariants={(buildVariants) =>
              dispatch({ type: "setSelectedBuildVariants", buildVariants })
            }
            disabled={disableBuildVariantSelect}
          />
        </PageSider>
        <PageLayout>
          <PageContent>
            <StyledTabs
              selected={selectedTab}
              setSelected={(i) =>
                dispatch({ type: "setSelectedTab", tabIndex: i })
              }
              aria-label="Configure Patch Tabs"
            >
              <Tab data-cy="tasks-tab" name="Configure">
                <ConfigureTasks
                  selectedBuildVariants={selectedBuildVariants}
                  selectedBuildVariantTasks={selectedBuildVariantTasks}
                  setSelectedBuildVariantTasks={(variantTasks) =>
                    dispatch({
                      type: "setSelectedBuildVariantTasks",
                      variantTasks,
                    })
                  }
                  activated={activated}
                  loading={loadingScheduledPatch}
                  onClickSchedule={onClickSchedule}
                  selectedDownstreamPatches={selectedDownstreamPatches}
                  setSelectedDownstreamPatches={(patches) =>
                    dispatch({
                      type: "setSelectedDownstreamPatches",
                      patches,
                    })
                  }
                />
              </Tab>
              <Tab data-cy="changes-tab" name="Changes">
                <CodeChanges />
              </Tab>
              <Tab data-cy="parameters-tab" name="Parameters">
                <ParametersContent
                  patchActivated={activated}
                  patchParameters={patchParams}
                  setPatchParams={(params) =>
                    dispatch({ type: "setPatchParams", params })
                  }
                />
              </Tab>
            </StyledTabs>
          </PageContent>
        </PageLayout>
      </PageLayout>
    </>
  );
};

const getGqlVariantTasksParamFromState = (
  selectedVariantTasks: VariantTasksState
): VariantTasks[] =>
  Object.entries(selectedVariantTasks)
    .map(([variantName, tasksObj]) => {
      const tasksArr = Object.entries(tasksObj)
        .filter((entry) => entry[1])
        .map((entry) => entry[0]);
      return {
        variant: variantName,
        tasks: tasksArr,
        displayTasks: [],
      };
    })
    .filter(({ tasks }) => tasks.length);

const getGqlDownstreamPatchesFromState = (
  selectedDownstreamPatches: DownstreamPatchState
) =>
  Object.entries(selectedDownstreamPatches)
    .filter(([, isSelected]) => isSelected)
    .map(([alias]) => alias);

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

const initializeDownstreamPatchState = (
  patchTriggerAliases: PatchTriggerAlias[]
) =>
  patchTriggerAliases.reduce(
    (prev, { alias }) => ({
      ...prev,
      [alias]: false,
    }),
    {}
  );

const indexToTabMap = [PatchTab.Tasks, PatchTab.Changes, PatchTab.Parameters];

const tabToIndexMap = {
  [PatchTab.Tasks]: 0,
  [PatchTab.Changes]: 1,
  [PatchTab.Parameters]: 2,
};

const StyledInput = styled(Input)`
  margin-bottom: 16px;
  font-weight: 600;
`;
const StyledBody = styled(Body)`
  margin-bottom: 4px;
`;
