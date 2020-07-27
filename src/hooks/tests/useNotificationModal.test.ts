import { renderHook, act } from "@testing-library/react-hooks";
import { useNotificationModal } from "hooks";
import {
  triggers as taskTriggers,
  subscriptionMethodControls as taskSubscriptionMethodControls,
} from "pages/task/actionButtons/TaskNotificationModal";
import {
  triggers as patchTriggers,
  subscriptionMethodControls as patchSubscriptionMethodControls,
} from "components/PatchActionButtons/addNotification/PatchNotificationModal";

// uuid relies on window.crypto.getRandomValues which is unsupported in these tests
jest.mock("uuid", () => ({
  v4: () => "",
}));

test("Should have correctly formatted request payload after selecting options (task)", () => {
  const { result } = renderHook(() =>
    useNotificationModal({
      triggers: taskTriggers,
      subscriptionMethodControls: taskSubscriptionMethodControls,
      resourceId: "a task id",
    })
  );

  act(() => {
    result.current.setExtraFieldInputVals({ "task-duration-secs": "33" });
    result.current.setTarget({ email: "email@email.com" });
    result.current.setSelectedTriggerIndex(3);
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

test("Should have correctly formatted request payload after selecting options, adding regex selectors and deleting regex selector (version)", () => {
  const { result } = renderHook(() =>
    useNotificationModal({
      triggers: patchTriggers,
      subscriptionMethodControls: patchSubscriptionMethodControls,
      resourceId: "a patch id",
    })
  );

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
