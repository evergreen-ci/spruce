import React, { useState } from "react";
import { PageContent, PageLayout, PageSider } from "components/styles";
import { P2 } from "components/Typography";
import { MetadataCard } from "components/MetadataCard";
import { StyledTabs } from "components/styles/StyledTabs";
import { Tab } from "@leafygreen-ui/tabs";
import { useTabs } from "hooks";
import { CodeChanges } from "pages/patch/patchTabs/CodeChanges";
import { paths } from "contants/routes";
import styled from "@emotion/styled/macro";
import { VariantsTasks, Patch } from "gql/queries/patch";
import { css } from "@emotion/core";
import { Input } from "antd";
import { ConfigureTasks } from "pages/configurePatch/configurePatchCore/ConfigureTasks";
import { ConfigureBuildVariants } from "pages/configurePatch/configurePatchCore/ConfigureBuildVariants";

enum PatchTab {
  Configure = "configure",
  Changes = "changes",
}
const DEFAULT_TAB = PatchTab.Configure;

const tabToIndexMap = {
  [PatchTab.Configure]: 0,
  [PatchTab.Changes]: 1,
};

interface TasksState {
  [task: string]: true;
}
export interface VariantTasksState {
  [variant: string]: TasksState;
}

const convertPatchVariantTasksToState = (
  variantsTasks?: VariantsTasks
): VariantTasksState | null =>
  variantsTasks
    ? variantsTasks.reduce((prev, { name: variant, tasks }) => {
        prev[variant] = tasks;
        return prev;
      }, {})
    : null;

interface Props {
  patch: Patch;
}
export const ConfigurePatchCore: React.FC<Props> = ({ patch }) => {
  const { project, variantsTasks } = patch;
  const { variants } = project;
  const [selectedTab, selectTabHandler] = useTabs(
    tabToIndexMap,
    paths.patch,
    DEFAULT_TAB
  );
  const [selectedBuildVariant, setSelectedBuildVariant] = useState<string>(
    variantsTasks[0].name
  );
  const [selectedVariantTasks, setSelectedVariantTasks] = useState<
    VariantTasksState
  >(convertPatchVariantTasksToState(variantsTasks));
  const [descriptionValue, setdescriptionValue] = useState<string>(
    patch.description
  );
  return (
    <>
      <StyledInput
        placeholder="Patch description"
        value={descriptionValue}
        size="large"
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setdescriptionValue(e.target.value)
        }
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

export const cardSidePadding = css`
  padding-left: 8px;
  padding-right: 8px;
`;
const StyledInput = styled(Input)`
  margin-bottom: 16px;
  font-weight: 600;
`;
