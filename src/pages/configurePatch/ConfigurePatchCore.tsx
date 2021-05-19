import React, { useEffect, useReducer } from "react";
import { useMutation } from "@apollo/client";
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { Tab } from "@leafygreen-ui/tabs";
import { Body } from "@leafygreen-ui/typography";
import { Input } from "antd";
import get from "lodash/get";
import { useHistory, useLocation, useParams, Redirect } from "react-router-dom";
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
import { ConfigureBuildVariants } from "pages/configurePatch/configurePatchCore/ConfigureBuildVariants";
import { ConfigureTasks } from "pages/configurePatch/configurePatchCore/ConfigureTasks";
import { CodeChanges } from "pages/patch/patchTabs/CodeChanges";
import { ParametersContent } from "pages/patch/patchTabs/ParametersContent";
import { PatchTab } from "types/patch";
import { queryString } from "utils";
import { mapStringArrayToObject } from "utils/array";

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
  | { type: "setSelectedTab"; tab: number };

const initialState = ({ selectedTab = 0 }) => ({
  description: "",
  selectedBuildVariants: [],
  selectedBuildVariantTasks: {},
  patchParams: null,
  selectedTab: 0,
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
        patchParams: action.params,
      };
    case "setSelectedTab":
      return {
        ...state,
        selectedTab: action.tab,
        disableBuildVariantSelect: indexToTabMap[action.tab] !== PatchTab.Tasks,
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

  const [schedulePatch, { data, loading: loadingScheduledPatch }] = useMutation<
    SchedulePatchMutation,
    SchedulePatchMutationVariables
  >(SCHEDULE_PATCH, {
    onCompleted() {
      dispatchToast.success("Successfully scheduled the patch");
    },
    onError(err) {
      dispatchToast.error(
        `There was an error scheduling this patch : ${err.message}`
      );
    },
  });

  const history = useHistory();
  const location = useLocation();
  const { tab } = useParams<{ tab: PatchTab | null }>();

  const { project, id } = patch;
  const { variants } = project;

  const [state, dispatch] = useReducer(
    reducer,
    initialState({ selectedTab: tabToIndexMap[tab] })
  );
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
      dispatch({ type: "setDescription", description: patch.description });
      dispatch({
        type: "setSelectedBuildVariants",
        buildVariants: [variants[0]?.name],
      });
      dispatch({
        type: "setPatchParams",
        params: patch?.parameters,
      });
      dispatch({
        type: "setSelectedBuildVariantTasks",
        variantTasks: convertPatchVariantTasksToStateShape(variants),
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
    try {
      await schedulePatch({
        variables: { patchId: id, configure: configurePatchParam },
      });
    } catch (error) {
      dispatchToast.error(
        `There was an error scheduling this patch: ${error.message}`
      );
    }
  };

  const scheduledPatchId = get(data, "schedulePatch.id");
  if (scheduledPatchId) {
    return <Redirect to={getVersionRoute(scheduledPatchId)} />;
  }

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
            <P2>Submitted by: {patch?.author}</P2>
            <P2>Submitted at: {patch?.time.submittedAt}</P2>
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
              setSelected={(t) => dispatch({ type: "setSelectedTab", tab: t })}
              aria-label="Configure Patch Tabs"
            >
              <Tab data-cy="tasks-tab" name="Configure">
                <ConfigureTasks
                  variants={variants}
                  selectedBuildVariant={selectedBuildVariants}
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
                  patchActivated={patch?.activated}
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

interface TasksState {
  [task: string]: boolean;
}
export interface VariantTasksState {
  [variant: string]: TasksState;
}

const convertPatchVariantTasksToStateShape = (
  variantsTasks?: VariantTask[]
): VariantTasksState =>
  variantsTasks.reduce(
    (prev, { name: variant, tasks }) => ({
      ...prev,
      [variant]: mapStringArrayToObject(tasks, false),
    }),
    {}
  );

const indexToTabMap = {
  0: PatchTab.Tasks,
  1: PatchTab.Changes,
  2: PatchTab.Parameters,
};

const tabToIndexMap = {
  [PatchTab.Tasks]: 0,
  [PatchTab.Changes]: 1,
  [PatchTab.Parameters]: 2,
};
export const cardSidePadding = css`
  padding-left: 8px;
  padding-right: 8px;
`;
const StyledInput = styled(Input)`
  margin-bottom: 16px;
  font-weight: 600;
`;
const StyledBody = styled(Body)`
  margin-bottom: 4px;
`;
