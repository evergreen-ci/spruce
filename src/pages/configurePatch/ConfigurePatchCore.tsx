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
import get from "lodash/get";

interface Props {
  patch: Patch;
}
export const ConfigurePatchCore: React.FC<Props> = ({ patch }) => {
  const { project, variantsTasks } = patch;
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
  const [selectedBuildVariant, setSelectedBuildVariant] = useState<
    string | null
  >(get(variants[0], "name", ""));
  const [selectedVariantTasks, setSelectedVariantTasks] = useState<
    VariantTasksState
  >(convertPatchVariantTasksToStateShape(variantsTasks));
  const [descriptionValue, setdescriptionValue] = useState<string>(
    patch.description || ""
  );
  const onChangePatchName = (e: React.ChangeEvent<HTMLInputElement>) =>
    setdescriptionValue(e.target.value);

  if (variants.length === 0 || tasks.length === 0) {
    return (
      // TODO: Full page error
      <PageLayout>
        <div data-cy="full-page-error">
          Something went wrong. This patch's project either has no variants or
          tasks associated with it.{" "}
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
