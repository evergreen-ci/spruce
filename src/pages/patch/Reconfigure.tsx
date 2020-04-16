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
import { Body, Disclaimer } from "@leafygreen-ui/typography";
import Button from "@leafygreen-ui/button";
import Badge, { Variant } from "@leafygreen-ui/badge";

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

interface TasksState {
  [task: string]: true;
}
interface VariantTasksState {
  [variant: string]: TasksState;
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

  const projectVariantTasksMap: {
    [variant: string]: string[];
  } = variants.reduce((prev, { name, tasks }) => {
    prev[name] = tasks;
    return prev;
  }, {});
  const currentTasks = projectVariantTasksMap[selectedBuildVariant];

  const onClickSelectAll = () => {
    const allTasksForVariant: TasksState = currentTasks.reduce((prev, curr) => {
      prev[curr] = true;
      return prev;
    }, {});
    setSelectedVariantTasks({
      ...selectedVariantTasks,
      [selectedBuildVariant]: allTasksForVariant,
    });
  };
  const onClickDeselectAll = () => {
    setSelectedVariantTasks({
      ...selectedVariantTasks,
      [selectedBuildVariant]: {},
    });
  };

  const taskCount = Object.values(selectedVariantTasks).reduce(
    (prev, curr) => prev + Object.values(curr).length,
    0
  );
  const buildVariantCount = Object.keys(selectedVariantTasks).length;

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
            {variants.map(({ displayName, name }) => {
              const taskCount = selectedVariantTasks[name]
                ? Object.keys(selectedVariantTasks[name]).length
                : null;
              const isSelected = selectedBuildVariant === name;
              return (
                <BuildVariant
                  key={name}
                  isSelected={isSelected}
                  onClick={getClickVariantHandler(name)}
                >
                  <VariantName>
                    <Body weight={isSelected ? "medium" : "regular"}>
                      {displayName}
                    </Body>
                  </VariantName>
                  {taskCount > 0 && (
                    <StyledBadge
                      variant={
                        isSelected ? Variant.DarkGray : Variant.LightGray
                      }
                    >
                      {taskCount}
                    </StyledBadge>
                  )}
                </BuildVariant>
              );
            })}
          </StyledSiderCard>
        </PageSider>
        <PageLayout>
          <PageContent>
            <StyledTabs selected={selectedTab} setSelected={selectTabHandler}>
              <Tab name="Configure" id="task-tab">
                <Actions>
                  <Button>Schedule</Button>
                  <ButtonLink onClick={onClickSelectAll}>Select All</ButtonLink>
                  <ButtonLink onClick={onClickDeselectAll}>
                    Deselect All
                  </ButtonLink>
                </Actions>
                <Disclaimer>
                  {`${taskCount} task${
                    taskCount !== 1 ? "s" : ""
                  } across ${buildVariantCount} build variant${
                    buildVariantCount !== 1 ? "s" : ""
                  }`}
                </Disclaimer>
                <Tasks>
                  {currentTasks.map((task) => {
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
                      />
                    );
                  })}
                </Tasks>
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

type VariantProps = { isSelected: boolean };

const cardSidePadding = css`
  padding-left: 8px;
  padding-right: 8px;
`;
const Actions = styled.div`
  margin-left: 8px;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  & > :first-child {
    margin-right: 40px;
  }
  & > :not(:first-child) {
    margin-right: 24px;
  }
`;
const Header = styled.div``;
const Tasks = styled.div`
  ${cardSidePadding}
`;
const BuildVariant = styled.div`
  display: flex;
  align-items: center;
  min-height: 32px;
  cursor: pointer;
  padding: 8px 0;
  ${cardSidePadding}
  background-color: ${(props: VariantProps) =>
    props.isSelected ? uiColors.green.light3 : "none"};
  border-left: 3px solid white;
  border-left-color: ${(props: VariantProps) =>
    props.isSelected ? uiColors.green.base : "none"};
`;
const VariantName = styled.div`
  word-break: break-all;
  white-space: normal;
`;
const StyledBadge = styled(Badge)`
  margin-left: 8px;
`;
const StyledInput = styled(Input)`
  margin-bottom: 16px;
  font-weight: 600;
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
const ButtonLink = styled.div`
  cursor: pointer;
`;
