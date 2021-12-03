import React from "react";
import { MockedProvider } from "@apollo/client/testing";
import { renderHook, act } from "@testing-library/react-hooks";
import {
  triggers as patchTriggers,
  subscriptionMethodControls as patchSubscriptionMethodControls,
} from "components/PatchActionButtons/addNotification/PatchNotificationModal";
import { GET_USER_SETTINGS, GET_USER } from "gql/queries";
import { useNotificationModal } from "hooks";
import {
  triggers as taskTriggers,
  subscriptionMethodControls as taskSubscriptionMethodControls,
} from "pages/task/actionButtons/TaskNotificationModal";

// uuid relies on window.crypto.getRandomValues which is unsupported in these tests
jest.mock("uuid", () => ({
  v4: () => Math.floor(Math.random() * Math.floor(Number.MAX_SAFE_INTEGER)),
}));

test("should have correctly formatted request payload after selecting options (task)", async () => {
  const mocks = [
    {
      request: {
        query: GET_USER_SETTINGS,
      },
      result: {
        data: {},
      },
    },
    {
      request: {
        query: GET_USER,
      },
      result: {
        data: {},
      },
    },
  ];
  const Provider = ({ children }) => (
    <MockedProvider mocks={mocks}>{children}</MockedProvider>
  );

  const { result } = renderHook(
    () =>
      useNotificationModal({
        triggers: taskTriggers,
        subscriptionMethodControls: taskSubscriptionMethodControls,
        resourceId: "a task id",
        type: "task",
      }),
    { wrapper: Provider }
  );

  act(() => {
    result.current.setExtraFieldInputVals({ "task-duration-secs": "33" });
    result.current.setTarget({ email: "email@email.com" });
    result.current.setSelectedTriggerIndex(5);
  });

  expect(result.current.getRequestPayload()).toStrictEqual({
    trigger: "exceeds-duration",
    resource_type: "TASK",
    selectors: [
      { type: "object", data: "task" },
      { type: "id", data: "a task id" },
    ],
    subscriber: { type: "email", target: "email@email.com" },
    trigger_data: { "task-duration-secs": "10" },
    owner_type: "person",
    regex_selectors: [],
  });
});

test("should have correctly formatted request payload after selecting options, adding regex selectors and deleting regex selector (version)", async () => {
  const mocks = [
    {
      request: {
        query: GET_USER_SETTINGS,
      },
      result: {
        data: {},
      },
    },
    {
      request: {
        query: GET_USER,
      },
      result: {
        data: {
          user: {
            userId: "",
            displayName: "",
            emailAddress: "",
            __typename: "User",
          },
        },
      },
    },
    {
      request: {
        query: GET_USER,
      },
      result: {
        data: {
          user: {
            userId: "",
            displayName: "",
            emailAddress: "",
            __typename: "User",
          },
        },
      },
    },
  ];
  const Provider = ({ children }) => (
    <MockedProvider mocks={mocks}>{children}</MockedProvider>
  );
  const { result, waitForNextUpdate } = renderHook(
    () =>
      useNotificationModal({
        triggers: patchTriggers,
        subscriptionMethodControls: patchSubscriptionMethodControls,
        resourceId: "a patch id",
        type: "version",
      }),
    { wrapper: Provider }
  );

  await waitForNextUpdate();

  act(() => {
    result.current.setSelectedTriggerIndex(5);
    result.current.setTarget({ email: "email@email.com" });
  });

  act(() => {
    result.current.regexSelectorProps[0].onChangeSelectedOption("display-name");
  });

  act(() => {
    result.current.regexSelectorProps[0].onChangeRegexValue({
      target: { value: "cheese" },
    } as React.ChangeEvent<HTMLInputElement>);
    result.current.onClickAddRegexSelector();
  });

  act(() => {
    result.current.regexSelectorProps[1].onChangeSelectedOption(
      "build-variant"
    );
  });
  act(() => {
    result.current.regexSelectorProps[1].onChangeRegexValue({
      target: { value: "pasta" },
    } as React.ChangeEvent<HTMLInputElement>);
  });

  expect(result.current.getRequestPayload()).toStrictEqual({
    trigger: "outcome",
    resource_type: "BUILD",
    selectors: [
      { type: "object", data: "build" },
      { type: "in-version", data: "a patch id" },
    ],
    subscriber: { type: "email", target: "email@email.com" },
    trigger_data: {},
    owner_type: "person",
    regex_selectors: [
      { type: "display-name", data: "cheese" },
      { type: "build-variant", data: "pasta" },
    ],
  });

  // delete second regex selector
  act(() => {
    result.current.regexSelectorProps[1].onDelete();
  });

  expect(result.current.getRequestPayload()).toStrictEqual({
    trigger: "outcome",
    resource_type: "BUILD",
    selectors: [
      { type: "object", data: "build" },
      { type: "in-version", data: "a patch id" },
    ],
    subscriber: { type: "email", target: "email@email.com" },
    trigger_data: {},
    owner_type: "person",
    regex_selectors: [{ type: "display-name", data: "cheese" }],
  });
});

test("should auto populate email and slack fields if they exist", async () => {
  const mocks = [
    {
      request: {
        query: GET_USER_SETTINGS,
      },
      result: {
        data: {
          userSettings: {
            timezone: "America/Chicago",
            region: "us-east-1",
            slackUsername: "mohamed.khelif",
            notifications: {
              buildBreak: "",
              commitQueue: "",
              patchFinish: "",
              patchFirstFailure: "",
              spawnHostExpiration: "",
              spawnHostOutcome: "",
              __typename: "Notifications",
            },
            githubUser: {
              lastKnownAs: "khelif96",
              __typename: "GithubUser",
            },
            useSpruceOptions: {
              hasUsedSpruceBefore: true,
              spruceV1: true,
              __typename: "UseSpruceOptions",
            },
            __typename: "UserSettings",
          },
        },
      },
    },
    {
      request: {
        query: GET_USER,
      },
      result: {
        data: {
          user: {
            userId: "",
            displayName: "",
            emailAddress: "mohamed.khelif@mongodb.com",
            __typename: "User",
          },
        },
      },
    },
    {
      request: {
        query: GET_USER,
      },
      result: {
        data: {
          user: {
            userId: "",
            displayName: "",
            emailAddress: "mohamed.khelif@mongodb.com",
            __typename: "User",
          },
        },
      },
    },
  ];
  const Provider = ({ children }) => (
    <MockedProvider mocks={mocks}>{children}</MockedProvider>
  );
  const { result, waitForNextUpdate } = renderHook(
    () =>
      useNotificationModal({
        triggers: patchTriggers,
        subscriptionMethodControls: patchSubscriptionMethodControls,
        resourceId: "a patch id",
        type: "version",
      }),
    { wrapper: Provider }
  );

  await waitForNextUpdate();

  act(() => {
    result.current.setSelectedTriggerIndex(5);
  });

  act(() => {
    result.current.setSelectedSubscriptionMethod("email");
  });

  expect(result.current.target).toStrictEqual({
    email: "mohamed.khelif@mongodb.com",
  });

  expect(result.current.getRequestPayload()).toStrictEqual({
    trigger: "outcome",
    resource_type: "BUILD",
    selectors: [
      { type: "object", data: "build" },
      { type: "in-version", data: "a patch id" },
    ],
    subscriber: { type: "email", target: "mohamed.khelif@mongodb.com" },
    trigger_data: {},
    owner_type: "person",
    regex_selectors: [],
  });

  act(() => {
    result.current.setSelectedSubscriptionMethod("slack");
  });
  expect(result.current.target).toStrictEqual({
    slack: "@mohamed.khelif",
  });
  expect(result.current.getRequestPayload()).toStrictEqual({
    trigger: "outcome",
    resource_type: "BUILD",
    selectors: [
      { type: "object", data: "build" },
      { type: "in-version", data: "a patch id" },
    ],
    subscriber: { type: "slack", target: "@mohamed.khelif" },
    trigger_data: {},
    owner_type: "person",
    regex_selectors: [],
  });
});
