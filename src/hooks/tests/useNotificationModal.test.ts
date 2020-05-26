import { renderHook, act } from "@testing-library/react-hooks";

import { useNotificationModal } from "hooks";
import { SubscriptionMethods, Trigger } from "hooks/useNotificationModal";
import {
  validateJira,
  validateEmail,
  validateSlack,
  validateDuration,
  validatePercentage,
} from "utils/validators";

test("Should have correctly formatted request payload after selecting options", () => {
  const { result } = renderHook(() =>
    useNotificationModal({
      triggers,
      subscriptionMethodControls,
      resourceType: "TASK",
      resourceId: "a task id",
    })
  );

  act(() => {
    result.current.setExtraFieldInputVals({ "task-duration-secs": "33" });
  });
  act(() => {
    result.current.setTarget({ email: "email@email.com" });
  });
  act(() => {
    result.current.setSelectedTriggerId("exceeds-duration");
  });
  expect(JSON.stringify(result.current.getRequestPayload())).toStrictEqual(
    `{"trigger":"exceeds-duration","resource_type":"TASK","selectors":[{"type":"object","data":"task"},{"type":"id","data":"a task id"}],"subscriber":{"type":"email","target":"email@email.com"},"trigger_data":{"task-duration-secs":"10"},"owner_type":"person","regex_selectors":[]}`
  );
});

const subscriptionMethodControls: SubscriptionMethods = {
  "jira-comment": {
    label: "JIRA Issue",
    placeholder: "ABC-123",
    targetPath: "jira-comment",
    validator: validateJira,
  },
  email: {
    label: "Email Address",
    placeholder: "someone@example.com",
    targetPath: "email",
    validator: validateEmail,
  },
  slack: {
    label: "Slack Username or Channel",
    placeholder: "@user",
    targetPath: "slack",
    validator: validateSlack,
  },
};

const triggers: Trigger[] = [
  {
    trigger: "outcome",
    label: "this task finishes",
  },
  {
    trigger: "failure",
    label: "this task fails",
  },
  {
    trigger: "success",
    label: "this task succeeds",
  },
  {
    trigger: "exceeds-duration",
    label: "the runtime for this task exceeds some duration",
    extraFields: [
      {
        text: "Task duration (seconds)",
        key: "task-duration-secs",
        validator: validateDuration,
      },
    ],
  },
  {
    trigger: "runtime-change",
    label: "this task succeeds and its runtime changes by some percentage",
    extraFields: [
      {
        text: "Percent change",
        key: "task-percent-change",
        validator: validatePercentage,
      },
    ],
  },
];
