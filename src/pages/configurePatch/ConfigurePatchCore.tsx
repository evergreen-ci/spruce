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
import { css } from "@emotion/core";
import { Input } from "antd";
import { ConfigureTasks } from "pages/configurePatch/configurePatchCore/ConfigureTasks";
import { ConfigureBuildVariants } from "pages/configurePatch/configurePatchCore/ConfigureBuildVariants";
import { Body } from "@leafygreen-ui/typography";
import { useMutation } from "@apollo/react-hooks";
import get from "lodash/get";
import { useHistory } from "react-router-dom";
import { SCHEDULE_PATCH } from "gql/mutations/schedule-patch";
import {
  SchedulePatchMutation,
  PatchReconfigure,
  SchedulePatchMutationVariables,
  VariantTasks,
  ConfigurePatchQuery,
  VariantTask,
} from "gql/generated/types";

interface Props {
  patch: ConfigurePatchQuery["patch"];
}
export const ConfigurePatchCore: React.FC<Props> = ({ patch }) => {
  const [
    schedulePatch,
    { data, error: errorSchedulingPatch, loading: loadingScheduledPatch },
  ] = useMutation<SchedulePatchMutation, SchedulePatchMutationVariables>(
    SCHEDULE_PATCH
  );
  const router = useHistory();
  const { project, variantsTasks, id } = patch;
  const { variants, tasks } = project;
  const [selectedTab, selectTabHandler] = useTabs({
    tabToIndexMap,
    defaultTab: DEFAULT_TAB,
    path: `${paths.patch}/${patch.id}/configure`,
  });
  useDefaultPath({
    tabToIndexMap,
    defaultPath: `${paths.patch}/${patch.id}/configure/${DEFAULT_TAB}`,
  });
  const [selectedBuildVariant, setSelectedBuildVariant] = useState<string[]>([
    get(variants[0], "name", ""),
  ]);
  const [selectedVariantTasks, setSelectedVariantTasks] = useState<
    VariantTasksState
  >(convertPatchVariantTasksToStateShape(variantsTasks));
  const [descriptionValue, setdescriptionValue] = useState<string>(
    patch.description || ""
  );
  const onChangePatchName = (e: React.ChangeEvent<HTMLInputElement>): void =>
    setdescriptionValue(e.target.value);

  const onClickSchedule = async (): Promise<void> => {
    const configurePatchParam: PatchReconfigure = {
      description: descriptionValue,
      variantsTasks: getGqlVariantTasksParamFromState(selectedVariantTasks),
    };
    try {
      await schedulePatch({
        variables: { patchId: id, reconfigure: configurePatchParam },
      });
    } catch (error) {
      // TODO: log this error
      // console.error(error);
    }
  };
  const scheduledPatchId = get(data, "schedulePatch.id");
  if (scheduledPatchId) {
    router.push(`${paths.version}/${scheduledPatchId}`);
  }
  if (variants.length === 0 || tasks.length === 0) {
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
              <Tab data-cy="changes-tab" name="Changes" id="changes-tab">
                <CodeChanges />
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
  Object.keys(selectedVariantTasks).map((variantName) => {
    const tasksObj = selectedVariantTasks[variantName];
    const tasksArr = Object.keys(tasksObj);
    const variantTasks: VariantTasks = {
      variant: variantName,
      tasks: tasksArr,
      displayTasks: [],
    };
    return variantTasks;
  });

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
