import React, { useState } from "react";
import {
  PageWrapper,
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
import { PatchProject, VariantsTasks } from "gql/queries/patch";
import { uiColors } from "@leafygreen-ui/palette";
import Checkbox from "@leafygreen-ui/checkbox";

interface Props {
  project: PatchProject;
  variantsTasks: VariantsTasks;
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

export const Reconfigure: React.FC<Props> = ({ project, variantsTasks }) => {
  const [selectedTab, selectTabHandler] = useTabs(
    tabToIndexMap,
    paths.patch,
    DEFAULT_TAB
  );

  const { variants } = project;

  const [selectedBuildVariant, setSelectedBuildVariant] = useState<string>(
    variants[0].name
  );
  const [selectedVariantTasks, setSelectedVariantTasks] = useState<
    VariantTasksState
  >({});

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
      {/* <PageTitle /> */}
      <PageLayout>
        <PageSider>
          <MetadataCard loading={false} error={null} title="Patch Metadata">
            <P2>Submitted by: </P2>
            <P2>Submitted at: </P2>
          </MetadataCard>
          <SiderCard>
            <VariantList>
              {variants.map(({ displayName, name }) => (
                <Variant
                  isSelected={selectedBuildVariant === name}
                  onClick={getClickVariantHandler(name)}
                >
                  {displayName}
                </Variant>
              ))}
            </VariantList>
          </SiderCard>
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

const Header = styled.div``;
const VariantList = styled.ul``;
const Variant = styled.li`
  cursor: pointer;
  background-color: ${(props: { isSelected: boolean }) =>
    props.isSelected ? uiColors.green.light3 : "none"};
`;
