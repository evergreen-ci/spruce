import React, { useEffect, useReducer } from "react";
import { useMutation } from "@apollo/client";
import styled from "@emotion/styled";
import { Tab } from "@leafygreen-ui/tabs";
import { Body } from "@leafygreen-ui/typography";
import { Input } from "antd";
import { useHistory, useLocation, useParams } from "react-router-dom";
import { MetadataCard } from "components/MetadataCard";
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
} from "gql/generated/types";
import { SCHEDULE_PATCH } from "gql/mutations";
import { CodeChanges } from "pages/patch/patchTabs/CodeChanges";
import { ParametersContent } from "pages/patch/patchTabs/ParametersContent";
import { PatchTab } from "types/patch";
import { queryString, string } from "utils";
import { convertArrayToObject, mapStringArrayToObject } from "utils/array";
import { ConfigureBuildVariants } from "./configurePatchCore/ConfigureBuildVariants";
import { ConfigureTasks } from "./configurePatchCore/ConfigureTasks";
import { VariantTasksState } from "./configurePatchCore/state";

const { omitTypename } = string;
const { parseQueryString } = queryString;

type configurePatchState = {
  description: string;
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
    };

const initialState = ({ selectedTab = 0 }: { selectedTab: number }) => ({
  description: "",
  selectedBuildVariants: [],
  selectedBuildVariantTasks: {},
  patchParams: null,
  selectedTab,
  disableBuildVariantSelect: tabToIndexMap[selectedTab] === PatchTab.Tasks,
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
    initialState({ selectedTab: indexToTabMap.indexOf(tab) })
  );

  const { project, id, author, time, activated } = patch;
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
            variants={variants}
            selectedVariantTasks={selectedBuildVariantTasks}
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
                  loading={loadingScheduledPatch}
                  onClickSchedule={onClickSchedule}
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
