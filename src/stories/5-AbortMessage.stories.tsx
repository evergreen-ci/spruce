import React from "react";
import { MemoryRouter } from "react-router-dom";
import { AbortMessage } from "pages/task/metadata/AbortMessage";

export default {
  title: "Task Abort Message",
  component: AbortMessage,
};

export const NoUser = () => (
  <MemoryRouter>
    <AbortMessage
      {...{
        buildVariantDisplayName: "~ Commit Queue",
        newVersion: null,
        prClosed: false,
        taskDisplayName: "api-task-server",
        taskID: "abc",
        user: null,
      }}
    />
  </MemoryRouter>
);

export const AbortedBecauseOfFailingTask = () => (
  <MemoryRouter>
    <AbortMessage
      {...{
        buildVariantDisplayName: "~ Commit Queue",
        newVersion: null,
        prClosed: false,
        taskDisplayName: "api-task-server",
        taskID: "abc",
        user: "apiserver",
      }}
    />
  </MemoryRouter>
);

export const AbortedBecauseOfNewVersion = () => (
  <MemoryRouter>
    <AbortMessage
      {...{
        buildVariantDisplayName: null,
        newVersion: "5ee1efb3d1fe073e194e8b5c",
        prClosed: false,
        taskDisplayName: null,
        taskID: null,
        user: "apiserver",
      }}
    />
  </MemoryRouter>
);

export const AbortedBecausePRClosed = () => (
  <MemoryRouter>
    <AbortMessage
      {...{
        buildVariantDisplayName: null,
        newVersion: null,
        prClosed: true,
        taskDisplayName: null,
        taskID: null,
        user: "apiserver",
      }}
    />
  </MemoryRouter>
);
