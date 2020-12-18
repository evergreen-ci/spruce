import React from "react";
import { MetadataCard } from "components/MetadataCard";
import { AbortMessage } from "pages/task/metadata/AbortMessage";

export default {
  title: "Task Abort Message",
  component: AbortMessage,
};

const Wrapper = ({ children }) => (
  <MetadataCard error={null} loading={false} title="Task Metadata">
    {children}
  </MetadataCard>
);

const abortInfoNoUser = {
  user: null,
  taskID: "abc",
  newVersion: null,
  prClosed: false,
  buildVariantDisplayName: "~ Commit Queue",
  taskDisplayName: "api-task-server",
};

const abortInfoTaskId = {
  user: "apiserver",
  taskID: "abc",
  newVersion: null,
  prClosed: false,
  buildVariantDisplayName: "~ Commit Queue",
  taskDisplayName: "api-task-server",
};

const abortInfoNewVersion = {
  user: "apiserver",
  taskID: null,
  newVersion: "5ee1efb3d1fe073e194e8b5c",
  prClosed: false,
  buildVariantDisplayName: null,
  taskDisplayName: null,
};

const abortInfoPRClosed = {
  user: "apiserver",
  taskID: null,
  newVersion: null,
  prClosed: true,
  buildVariantDisplayName: null,
  taskDisplayName: null,
};

export const NoUser = () => (
  <Wrapper>
    <AbortMessage {...abortInfoNoUser} />
  </Wrapper>
);

export const AbortedBecauseOfFailingTask = () => (
  <Wrapper>
    <AbortMessage {...abortInfoTaskId} />
  </Wrapper>
);

export const AbortedBecauseOfNewVersion = () => (
  <Wrapper>
    <AbortMessage {...abortInfoNewVersion} />
  </Wrapper>
);

export const AbortedBecausePRClosed = () => (
  <Wrapper>
    <AbortMessage {...abortInfoPRClosed} />
  </Wrapper>
);
