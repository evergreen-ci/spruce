import React, { useState } from "react";
import {
  PageContent,
  PageLayout,
  PageSider,
  SiderCard,
} from "components/styles";
import { P2 } from "components/Typography";
import { MetadataCard } from "components/MetadataCard";
import { StyledTabs } from "components/styles/StyledTabs";
import { Tab } from "@leafygreen-ui/tabs";
import { useTabs } from "hooks";
import { CodeChanges } from "pages/patch/patchTabs/CodeChanges";
import { paths } from "contants/routes";
import styled from "@emotion/styled/macro";
import { css } from "@emotion/core";
import { PatchProject, VariantsTasks } from "gql/queries/patch";
import { uiColors } from "@leafygreen-ui/palette";
import Checkbox from "@leafygreen-ui/checkbox";
import { Input } from "antd";
import { Divider } from "components/styles/Divider";
import { Body } from "@leafygreen-ui/typography";

interface Props {
  project: PatchProject;
  variantsTasks: VariantsTasks;
  description: string;
}

enum PatchTab {
  Configure = "configure",
  Changes = "changes",
}
const DEFAULT_TAB = PatchTab.Configure;

const tabToIndexMap = {
  [PatchTab.Configure]: 0,
  [PatchTab.Changes]: 1,
};

interface VariantTasksState {
  [variant: string]: {
    task: true;
  };
}

const convertPatchVariantTasksToState = (
  variantsTasks: VariantsTasks
): VariantTasksState =>
  variantsTasks.reduce((prev, { name: variant, tasks }) => {
    prev[variant] = tasks;
    return prev;
  }, {});

export const Reconfigure: React.FC<Props> = ({
  project,
  variantsTasks,
  description,
}) => {
  const { variants } = project;
  const [selectedTab, selectTabHandler] = useTabs(
    tabToIndexMap,
    paths.patch,
    DEFAULT_TAB
  );
  const [selectedBuildVariant, setSelectedBuildVariant] = useState<string>(
    variants[0].name
  );
  const [selectedVariantTasks, setSelectedVariantTasks] = useState<
    VariantTasksState
  >(convertPatchVariantTasksToState(variantsTasks));
  const [descriptionValue, setdescriptionValue] = useState<string>(
    description || ""
  );

  const getClickVariantHandler = (variantName: string) => () =>
    setSelectedBuildVariant(variantName);

  const getTaskCheckboxChangeHandler = (task: string, variant: string) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { checked } = e.target;
    const nextVariantTasks = { ...selectedVariantTasks[variant] };
    if (checked) {
      setSelectedVariantTasks({
        ...selectedVariantTasks,
        [variant]: { ...nextVariantTasks, [task]: true },
      });
    } else {
      delete nextVariantTasks[task];
      setSelectedVariantTasks({
        ...selectedVariantTasks,
        [variant]: nextVariantTasks,
      });
    }
  };

  const projectVariantTasksMap = variants.reduce((prev, { name, tasks }) => {
    prev[name] = tasks;
    return prev;
  }, {});

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
          <MetadataCard loading={false} error={null} title="Patch Metadata">
            <P2>Submitted by: </P2>
            <P2>Submitted at: </P2>
          </MetadataCard>
          <StyledSiderCard>
            <CardHeaderWrapper>
              <Body weight="medium">Select Build Variants and Tasks</Body>
              <StyledDivider />
            </CardHeaderWrapper>
            {variants.map(({ displayName, name }) => (
              <Variant
                key={name}
                isSelected={selectedBuildVariant === name}
                onClick={getClickVariantHandler(name)}
              >
                {displayName}
              </Variant>
            ))}
          </StyledSiderCard>
        </PageSider>
        <PageLayout>
          <PageContent>
            <StyledTabs selected={selectedTab} setSelected={selectTabHandler}>
              <Tab name="Configure" id="task-tab">
                <Header></Header>
                <div>
                  {projectVariantTasksMap[selectedBuildVariant].map((task) => {
                    const checked =
                      !!selectedVariantTasks[selectedBuildVariant] &&
                      selectedVariantTasks[selectedBuildVariant][task] === true;
                    return (
                      <Checkbox
                        key={task}
                        data-cy="variant-task"
                        onChange={getTaskCheckboxChangeHandler(
                          task,
                          selectedBuildVariant
                        )}
                        label={task}
                        checked={checked}
                        bold={false}
                      />
                    );
                  })}
                </div>
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

const cardSidePadding = css`
  padding-left: 8px;
  padding-right: 8px;
`;
const Header = styled.div``;
const Variant = styled.div`
  display: flex;
  align-items: center;
  height: 32px;
  cursor: pointer;
  ${cardSidePadding}
  background-color: ${(props: { isSelected: boolean }) =>
    props.isSelected ? uiColors.green.light3 : "none"};
  border-left: 3px solid white;
  border-left-color: ${(props: { isSelected: boolean }) =>
    props.isSelected ? uiColors.green.base : "none"};
`;
const StyledInput = styled(Input)`
  margin-bottom: 16px;
`;
const StyledSiderCard = styled(SiderCard)`
  padding-left: 0;
  padding-right: 0;
`;
const CardHeaderWrapper = styled.div`
  ${cardSidePadding}
`;
const StyledDivider = styled(Divider)`
  margin-bottom: 0;
`;
