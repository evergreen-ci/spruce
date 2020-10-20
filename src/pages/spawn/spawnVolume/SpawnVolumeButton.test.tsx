import { MockedProvider } from "@apollo/client/testing";
import React from "react";
import { customRenderWithRouterMatch as render } from "test_utils/test-utils";

const mocks = [];

test("Renders the metadata card with a pending status", async () => {
  const ContentWrapper = () => (
    <MockedProvider mocks={mocks}>
      <Metadata
        taskId={taskId}
        loading={false}
        data={taskAboutToStart}
        error={undefined}
      />
    </MockedProvider>
  );

  const { queryByDataCy } = render(ContentWrapper);
});

test("Renders the metadata card with a started status", async () => {
  const ContentWrapper = () => (
    <MockedProvider mocks={mocks}>
      <Metadata
        taskId={taskId}
        loading={false}
        data={taskStarted}
        error={undefined}
      />
    </MockedProvider>
  );

  const { queryByDataCy } = render(withRouter(ContentWrapper), {
    route: `/task/${taskId}`,
    path: "/task/:id",
  });
  expect(queryByDataCy("task-metadata-estimated_start")).toBeNull();
  expect(queryByDataCy("metadata-eta-timer")).toBeInTheDocument();
  expect(queryByDataCy("task-metadata-started")).toBeInTheDocument();
  expect(queryByDataCy("task-metadata-finished")).toBeNull();
});

test("Renders the metadata card with a succeeded status", async () => {
  const ContentWrapper = () => (
    <MockedProvider mocks={mocks}>
      <Metadata
        taskId={taskId}
        loading={false}
        data={taskSucceeded}
        error={undefined}
      />
    </MockedProvider>
  );

  const { queryByDataCy } = render(withRouter(ContentWrapper), {
    route: `/task/${taskId}`,
    path: "/task/:id",
  });

  expect(queryByDataCy("task-metadata-estimated_start")).toBeNull();
  expect(queryByDataCy("metadata-eta-timer")).toBeNull();
  expect(queryByDataCy("task-metadata-started")).toBeInTheDocument();
  expect(queryByDataCy("task-metadata-finished")).toBeInTheDocument();
});
