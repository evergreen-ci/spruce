import { renderHook, act } from "@testing-library/react-hooks";

import { usePatchStatusSelect } from "hooks";

test("should have no tasks and no valid statuses selected by default", () => {
  const { result } = renderHook(() => usePatchStatusSelect(patchBuildVariants));
  expect(result.current[0]).toStrictEqual([]);
});

test("should select all tasks that match a selected valid status", () => {
  const { result } = renderHook(() => usePatchStatusSelect(patchBuildVariants));
  act(() => {
    result.current[2].setValidStatus(["success"]);
  });
  expect(result.current[0]).toEqual(successStatusIds);
});

test("should deselect all tasks that no longer match a selected tasks status", () => {
  const { result } = renderHook(() => usePatchStatusSelect(patchBuildVariants));
  act(() => {
    result.current[2].setValidStatus(["success"]);
  });
  expect(result.current[0]).toEqual(successStatusIds);
  act(() => {
    result.current[2].setValidStatus([]);
  });
  expect(result.current[0]).toStrictEqual([]);
});

test("selecting multiple valid statuses should select all matching task status", () => {
  const { result } = renderHook(() => usePatchStatusSelect(patchBuildVariants));
  act(() => {
    result.current[2].setValidStatus(["success", "failed"]);
  });
  expect(result.current[0]).toEqual([...successStatusIds, ...failedStatusIds]);
});

test("selecting an individual task should work", () => {
  const { result } = renderHook(() => usePatchStatusSelect(patchBuildVariants));
  act(() => {
    result.current[2].toggleSelectedTask("evergreen_lint_generate_lint");
  });
  expect(result.current[0]).toEqual(["evergreen_lint_generate_lint"]);
});

test("deselecting an individual task should work if it was selected by valid statuses", () => {
  const { result } = renderHook(() => usePatchStatusSelect(patchBuildVariants));
  act(() => {
    result.current[2].setValidStatus(["success"]);
  });
  expect(result.current[0]).toEqual(successStatusIds);
  act(() => {
    result.current[2].toggleSelectedTask("evergreen_lint_generate_lint");
  });
  const resultArray = [...successStatusIds];
  resultArray.splice(0, 1);
  expect(result.current[0]).toEqual(resultArray);
});
const patchBuildVariants = [
  {
    variant: "lint",
    tasks: [
      {
        id: "evergreen_lint_generate_lint",
        name: "generate-lint",
        status: "success",
        __typename: "PatchBuildVariantTask",
      },
      {
        id: "evergreen_lint_lint_service",
        name: "lint-service",
        status: "success",
        __typename: "PatchBuildVariantTask",
      },
    ],
    __typename: "PatchBuildVariant",
  },
  {
    variant: "ubuntu1604",
    tasks: [
      {
        id: "evergreen_ubuntu1604_js_test",
        name: "js-test",
        status: "success",
        __typename: "PatchBuildVariantTask",
      },
      {
        id: "evergreen_ubuntu1604_test_model_distro",
        name: "test-model-distro",
        status: "success",
        __typename: "PatchBuildVariantTask",
      },
      {
        id: "evergreen_ubuntu1604_test_model_event",
        name: "test-model-event",
        status: "success",
        __typename: "PatchBuildVariantTask",
      },
      {
        id: "evergreen_ubuntu1604_test_model_grid",
        name: "test-model-grid",
        status: "success",
        __typename: "PatchBuildVariantTask",
      },
      {
        id: "evergreen_ubuntu1604_test_model_host",
        name: "test-model-host",
        status: "success",
        __typename: "PatchBuildVariantTask",
      },
      {
        id: "evergreen_ubuntu1604_test_service",
        name: "test-service",
        status: "failed",
        __typename: "PatchBuildVariantTask",
      },
    ],
    __typename: "PatchBuildVariant",
  },
  {
    variant: "variant",
    tasks: [
      {
        id: "evergreen_ubuntu1604_89",
        name: "test-thirdparty",
        status: "started",
        __typename: "PatchBuildVariantTask",
      },
    ],
    __typename: "PatchBuildVariant",
  },
];

const successStatusIds = [
  "evergreen_lint_generate_lint",
  "evergreen_lint_lint_service",
  "evergreen_ubuntu1604_js_test",
  "evergreen_ubuntu1604_test_model_distro",
  "evergreen_ubuntu1604_test_model_event",
  "evergreen_ubuntu1604_test_model_grid",
  "evergreen_ubuntu1604_test_model_host",
];

const failedStatusIds = ["evergreen_ubuntu1604_test_service"];
