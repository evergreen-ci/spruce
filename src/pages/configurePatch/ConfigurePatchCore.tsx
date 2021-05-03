import React, { useState, useEffect } from "react";
import { useMutation } from "@apollo/client";
import { css } from "@emotion/react";
import styled from "@emotion/styled/macro";
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
import { queryString, string } from "utils";

const { omitTypename } = string;
const { parseQueryString } = queryString;

interface Props {
  patch: ConfigurePatchQuery["patch"];
}
export const ConfigurePatchCore: React.FC<Props> = ({ patch }) => {
  const dispatchToast = useToastContext();

  const [schedulePatch, { data, loading: loadingScheduledPatch }] = useMutation<
    SchedulePatchMutation,
    SchedulePatchMutationVariables
  >(SCHEDULE_PATCH, {
    onError(err) {
      dispatchToast.error(err.message);
    },
  });
  const history = useHistory();
  const location = useLocation();
  const { tab: urlTab } = useParams<{ tab: PatchTab | null }>();

  const { project, variantsTasks, id } = patch;
  const { variants } = project;

  const [selectedTab, selectTabHandler] = useState(
    tabToIndexMap[urlTab] || tabToIndexMap[DEFAULT_TAB]
  );

  useEffect(() => {
    const query = parseQueryString(location.search);
    history.replace(
      getPatchRoute(id, {
        configure: true,
        tab: Object.values(PatchTab)[selectedTab],
        ...query,
      })
    );
  }, [selectedTab]); // eslint-disable-line react-hooks/exhaustive-deps

  const defaultSelectedVariant = variants[0]?.name;
  const [selectedBuildVariant, setSelectedBuildVariant] = useState<string[]>([
    defaultSelectedVariant,
  ]);

  const [
    selectedVariantTasks,
    setSelectedVariantTasks,
  ] = useState<VariantTasksState>(
    convertPatchVariantTasksToStateShape(variantsTasks)
  );
  const [descriptionValue, setdescriptionValue] = useState<string>(
    patch.description || ""
  );
  const [patchParams, setPatchParams] = useState<ParameterInput[]>(
    omitTypename(patch?.parameters)
  );

  const onChangePatchName = (e: React.ChangeEvent<HTMLInputElement>): void =>
    setdescriptionValue(e.target.value);

  const onClickSchedule = async (): Promise<void> => {
    const configurePatchParam: PatchConfigure = {
      description: descriptionValue,
      variantsTasks: getGqlVariantTasksParamFromState(selectedVariantTasks),
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
        data-cy="configurePatch-nameInput"
        value={descriptionValue}
        size="large"
        onChange={onChangePatchName}
      />
      <PageLayout>
        <PageSider>
          <MetadataCard error={null} title="Patch Metadata">
            <P2>Submitted by: {patch?.author}</P2>
            <P2>Submitted at: {patch?.time.submittedAt}</P2>
          </MetadataCard>
          <DisableWrapper
            data-cy="select-variants-and-task-card-wrapper"
            disabled={selectedTab !== 0}
          >
            <ConfigureBuildVariants
              variants={variants}
              selectedVariantTasks={selectedVariantTasks}
              selectedBuildVariant={selectedBuildVariant}
              setSelectedBuildVariant={setSelectedBuildVariant}
            />
          </DisableWrapper>
        </PageSider>
        <PageLayout>
          <PageContent>
            <StyledTabs
              selected={selectedTab}
              setSelected={selectTabHandler}
              aria-label="Configure Patch Tabs"
            >
              <Tab name="Configure" id="task-tab">
                <ConfigureTasks
                  {...{
                    variants,
                    selectedBuildVariant,
                    selectedVariantTasks,
                    setSelectedVariantTasks,
                    loading: loadingScheduledPatch,
                    onClickSchedule,
                  }}
                />
              </Tab>
              <Tab data-cy="changes-tab" name="Changes" id="changes-tab">
                <CodeChanges />
              </Tab>
              <Tab
                data-cy="parameters-tab"
                name="Parameters"
                id="parameters-tab"
              >
                <ParametersContent
                  patchActivated={patch?.activated}
                  patchParameters={patchParams}
                  setPatchParams={setPatchParams}
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

const convertArrayOfStringsToMap = (arrayOfStrings: string[]): TasksState =>
  arrayOfStrings.reduce((prev, curr) => ({ ...prev, [curr]: true }), {});

const convertPatchVariantTasksToStateShape = (
  variantsTasks?: VariantTask[]
): VariantTasksState =>
  variantsTasks.reduce(
    (prev, { name: variant, tasks }) => ({
      ...prev,
      [variant]: convertArrayOfStringsToMap(tasks),
    }),
    {}
  );

const DEFAULT_TAB = PatchTab.Configure;
const tabToIndexMap = {
  [PatchTab.Configure]: 0,
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
const DisableWrapper = styled.div`
  ${(props: { disabled: boolean }) =>
    props.disabled && "opacity:0.4;pointer-events:none;"}
`;
