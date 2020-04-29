import React, { useState } from "react";
import { PageContent, PageLayout, PageSider } from "components/styles";
import { P2 } from "components/Typography";
import { MetadataCard } from "components/MetadataCard";
import { StyledTabs } from "components/styles/StyledTabs";
import { Tab } from "@leafygreen-ui/tabs";
import { useTabs, useDefaultPath } from "hooks";
import { CodeChanges } from "pages/patch/patchTabs/CodeChanges";
import { paths } from "constants/routes";
import styled from "@emotion/styled/macro";
import { VariantsTasks, Patch } from "gql/queries/patch";
import { css } from "@emotion/core";
import { Input } from "antd";
import { ConfigureTasks } from "pages/configurePatch/configurePatchCore/ConfigureTasks";
import { ConfigureBuildVariants } from "pages/configurePatch/configurePatchCore/ConfigureBuildVariants";
import { Body } from "@leafygreen-ui/typography";
import gql from "graphql-tag";
import { useMutation } from "@apollo/react-hooks";
import get from "lodash/get";
import { useHistory } from "react-router-dom";

const SCHEDULE_PATCH = gql`
  mutation SchedulePatch($patchId: String!, $reconfigure: PatchReconfigure!) {
    schedulePatch(patchId: $patchId, reconfigure: $reconfigure) {
      id
      activated
      version
      description
      status
      version
      activated
      tasks
      variants
      variantsTasks {
        name
        tasks
      }
    }
  }
`;
interface Props {
  patch: Patch;
}
export const ConfigurePatchCore: React.FC<Props> = ({ patch }) => {
  const [
    schedulePatch,
    { data, error: errorSchedulingPatch, loading: loadingScheduledPatch },
  ] = useMutation(SCHEDULE_PATCH);
  const router = useHistory();
  const { project, variantsTasks, id } = patch;
  const { variants } = project;
  const [selectedTab, selectTabHandler] = useTabs({
    tabToIndexMap,
    defaultTab: DEFAULT_TAB,
    path: `${paths.patch}/${patch.id}/configure`,
  });
  useDefaultPath({
    tabToIndexMap,
    defaultPath: `${paths.patch}/${patch.id}/configure/${DEFAULT_TAB}`,
  });
  const [selectedBuildVariant, setSelectedBuildVariant] = useState<string>(
    variants[0].name
  );
  const [selectedVariantTasks, setSelectedVariantTasks] = useState<
    VariantTasksState
  >(convertPatchVariantTasksToStateShape(variantsTasks));
  const [descriptionValue, setdescriptionValue] = useState<string>(
    patch.description
  );
  const onChangePatchName = (e: React.ChangeEvent<HTMLInputElement>) =>
    setdescriptionValue(e.target.value);

  const onClickSchedule = async () => {
    const configurePatchParam: PatchConfigureGqlParam = {
      description: descriptionValue,
      variantsTasks: getGqlVariantTasksParamFromState(selectedVariantTasks),
    };
    try {
      await schedulePatch({
        variables: { patchId: id, reconfigure: configurePatchParam },
      });
    } catch (error) {
      console.error(error);
    }
  };

  if (errorSchedulingPatch) {
    // TODO: show error banner at top of page
    console.error(errorSchedulingPatch);
  }
  const scheduledPatchId = get(data, "schedulePatch.id");
  if (scheduledPatchId) {
    router.push(`${paths.patch}/${scheduledPatchId}`);
  }
  return (
    <>
      {errorSchedulingPatch && (
        // TODO: replace with error banner
        <div data-cy="error-banner">
          There was a problem trying to schedule patch.
        </div>
      )}
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
          <ConfigureBuildVariants
            {...{
              variants,
              selectedVariantTasks,
              selectedBuildVariant,
              setSelectedBuildVariant,
            }}
          />
        </PageSider>
        <PageLayout>
          <PageContent>
            <StyledTabs selected={selectedTab} setSelected={selectTabHandler}>
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
              <Tab name="Changes" id="changes-tab">
                <CodeChanges />
              </Tab>
            </StyledTabs>
          </PageContent>
        </PageLayout>
      </PageLayout>
    </>
  );
};

interface DisplayTask {
  name: string;
  execTasks: string[];
}
interface VariantTasks {
  variant: string;
  tasks: string[];
  displayTasks: DisplayTask[];
}
interface PatchConfigureGqlParam {
  description: string;
  variantsTasks: VariantTasks[];
}
const getGqlVariantTasksParamFromState = (
  selectedVariantTasks: VariantTasksState
): VariantTasks[] => {
  return Object.keys(selectedVariantTasks).map((variantName) => {
    const tasksObj = selectedVariantTasks[variantName];
    const tasksArr = Object.keys(tasksObj);
    const variantTasks: VariantTasks = {
      variant: variantName,
      tasks: tasksArr,
      displayTasks: [],
    };
    return variantTasks;
  });
};

interface TasksState {
  [task: string]: true;
}
export interface VariantTasksState {
  [variant: string]: TasksState;
}
enum PatchTab {
  Configure = "tasks",
  Changes = "changes",
}

const convertArrayOfStringsToMap = (arrayOfStrings: string[]): TasksState =>
  arrayOfStrings.reduce((prev, curr) => ({ ...prev, [curr]: true }), {});

const convertPatchVariantTasksToStateShape = (
  variantsTasks?: VariantsTasks
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
