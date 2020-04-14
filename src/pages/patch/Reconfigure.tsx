import React from "react";
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

export const Reconfigure: React.FC<Props> = ({ project, variantsTasks }) => {
  const [selectedTab, selectTabHandler] = useTabs(
    tabToIndexMap,
    paths.patch,
    DEFAULT_TAB
  );

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
            {project.variants.map(({ displayName }) => (
              <div>{displayName}</div>
            ))}
          </SiderCard>
        </PageSider>
        <PageLayout>
          <PageContent>
            <StyledTabs selected={selectedTab} setSelected={selectTabHandler}>
              <Tab name="Configure" id="task-tab">
                <Header></Header>
                <div></div>
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
