import React from "react";
import { useParams } from "react-router-dom";
import { TestsTable } from "pages/task/TestsTable";
import { FilesTables } from "./task/FilesTables";
import { BreadCrumb } from "components/Breadcrumb";
import { TaskStatusBadge } from "components/TaskStatusBadge";
import { Logs } from "pages/task/Logs";
import gql from "graphql-tag";
import { useQuery } from "@apollo/react-hooks";
import { H2 } from "components/Typography";
import {
  PageWrapper,
  SiderCard,
  PageHeader,
  PageContent,
  PageLayout,
  PageSider
} from "components/styles";
import { useDefaultPath, useTabs } from "hooks";
import { Tab } from "@leafygreen-ui/tabs";
import { StyledTabs } from "components/styles/StyledTabs";
import { paths } from "contants/routes";
import { Skeleton } from "antd";
import styled from "@emotion/styled";

enum TaskTab {
  Logs = "logs",
  Tests = "tests",
  Files = "files",
  BuildBaron = "build-baron"
}
const tabToIndexMap = {
  [TaskTab.Logs]: 0,
  [TaskTab.Tests]: 1,
  [TaskTab.Files]: 2,
  [TaskTab.BuildBaron]: 3
};
const DEFAULT_TAB = TaskTab.Logs;

const GET_TASK = gql`
  query GetTask($taskId: String!) {
    task(taskId: $taskId) {
      version
      displayName
      patchNumber
      status
    }
  }
`;

interface TaskQuery {
  task: {
    version: string;
    displayName: string;
    patchNumber: number;
    status: string;
  };
}

export const Task: React.FC = () => {
  useDefaultPath(tabToIndexMap, paths.task, DEFAULT_TAB);
  const [selectedTab, selectTabHandler] = useTabs(
    tabToIndexMap,
    paths.task,
    DEFAULT_TAB
  );

  const { id } = useParams<{ id: string }>();
  const { data, loading, error } = useQuery<TaskQuery>(GET_TASK, {
    variables: { taskId: id }
  });

  if (loading) {
    return <div>"Loading..."</div>;
  }
  if (error) {
    return <div>{error.message}</div>;
  }
  const {
    task: { displayName, version, patchNumber, status }
  } = data;

  return (
    <PageWrapper>
      <BreadCrumb
        taskName={displayName}
        versionId={version}
        patchNumber={patchNumber}
      />
      {loading ? (
        <PageHeader>
          <Skeleton active={true} paragraph={{ rows: 0 }} />
        </PageHeader>
      ) : displayName || status ? (
        <PageHeader>
          <H2 id="task-name">{displayName}</H2>
          {"  "}
          <BadgeWrapper>
            <TaskStatusBadge status={status} />
          </BadgeWrapper>
        </PageHeader>
      ) : null}
      <PageLayout>
        <PageSider>
          <SiderCard>Patch Metadata</SiderCard>
          <SiderCard>Build Variants</SiderCard>
        </PageSider>
        <PageLayout>
          <PageContent>
            <StyledTabs selected={selectedTab} setSelected={selectTabHandler}>
              <Tab name="Logs" id="task-logs-tab">
                <Logs />
              </Tab>
              <Tab name="Tests" id="task-tests-tab">
                <TestsTable />
              </Tab>
              <Tab name="Files" id="task-files-tab">
                <FilesTables />
              </Tab>
            </StyledTabs>
          </PageContent>
        </PageLayout>
      </PageLayout>
    </PageWrapper>
  );
};

const BadgeWrapper = styled.span`
  top: -3px;
  position: relative;
`;
