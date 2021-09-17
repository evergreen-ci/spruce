import { renderHook, act } from "@testing-library/react-hooks";
import { usePatchStatusSelect } from "hooks";
import { waitFor } from "test_utils/test-utils";

const allFalse = {
  evergreen_lint_generate_lint: false,
  evergreen_lint_lint_service: false,
  evergreen_ubuntu1604_89: false,
  evergreen_ubuntu1604_js_test: false,
  evergreen_ubuntu1604_test_model_distro: false,
  evergreen_ubuntu1604_test_model_event: false,
  evergreen_ubuntu1604_test_model_grid: false,
  evergreen_ubuntu1604_test_model_host: false,
  evergreen_ubuntu1604_test_service: false,
};

const allTrue = {
  evergreen_lint_generate_lint: true,
  evergreen_lint_lint_service: true,
  evergreen_ubuntu1604_89: true,
  evergreen_ubuntu1604_js_test: true,
  evergreen_ubuntu1604_test_model_distro: true,
  evergreen_ubuntu1604_test_model_event: true,
  evergreen_ubuntu1604_test_model_grid: true,
  evergreen_ubuntu1604_test_model_host: true,
  evergreen_ubuntu1604_test_service: true,
};

test("should have no tasks and no valid statuses selected by default", () => {
  const { result } = renderHook(() =>
    usePatchStatusSelect(patchBuildVariants, versionId, childVersion)
  );
  expect(result.current[0][versionId]).toStrictEqual(allFalse);
});

test("should select all tasks that match the patch status filter when the base status filter is empty", () => {
  const { result } = renderHook(() =>
    usePatchStatusSelect(patchBuildVariants, versionId, childVersion)
  );
  act(() => {
    result.current[3][versionId].setPatchStatusFilterTerm({
      mainVersion: ["success"],
    });
  });
  act(() => {
    result.current[3][versionId].setBaseStatusFilterTerm({});
  });
  expect(result.current[0][versionId]).toEqual(successStatusIds);
});

test("should select all tasks that match the base status filter when the patch status filter is empty", () => {
  const { result } = renderHook(() =>
    usePatchStatusSelect(patchBuildVariants, versionId, childVersion)
  );
  act(() => {
    result.current[3][versionId].setPatchStatusFilterTerm({});
  });
  act(() => {
    result.current[3][versionId].setBaseStatusFilterTerm({
      mainVersion: ["success"],
    });
  });
  expect(result.current[0][versionId]).toEqual({
    ...allFalse,
    evergreen_ubuntu1604_test_service: true,
  });
});

test("should select all tasks that match the patch status filter when the base status filter is empty", () => {
  const { result } = renderHook(() =>
    usePatchStatusSelect(patchBuildVariants, versionId, childVersion)
  );
  act(() => {
    result.current[3][versionId].setPatchStatusFilterTerm({
      mainVersion: ["success"],
    });
  });
  act(() => {
    result.current[3][versionId].setBaseStatusFilterTerm({});
  });
  expect(result.current[0][versionId]).toEqual(successStatusIds);
});

test("should select all tasks that match the patch status filter and base status filter when both filters have active filter terms.", () => {
  const { result } = renderHook(() =>
    usePatchStatusSelect(patchBuildVariants, versionId, childVersion)
  );
  act(() => {
    result.current[3][versionId].setPatchStatusFilterTerm({
      mainVersion: ["failed"],
    });
  });
  act(() => {
    result.current[3][versionId].setBaseStatusFilterTerm({
      mainVersion: ["success"],
    });
  });
  waitFor(() =>
    expect(result.current[0][versionId]).toEqual({
      ...allFalse,
      evergreen_ubuntu1604_test_service: true,
    })
  );
});

test("tasks with undefined base statuses do not match with any base status filter state.", () => {
  const { result } = renderHook(() =>
    usePatchStatusSelect(patchBuildVariants, versionId, childVersion)
  );
  act(() => {
    result.current[3][versionId].setPatchStatusFilterTerm({
      mainVersion: ["success"],
    });
  });
  act(() => {
    result.current[3][versionId].setBaseStatusFilterTerm({
      mainVersion: ["success", "fakeStatus", "random"],
    });
  });
  waitFor(() =>
    expect(result.current[0][versionId]).toEqual({
      ...allFalse,
    })
  );
});

test("should deselect all tasks with statuses that do not match any patch status filter terms.", () => {
  const { result } = renderHook(() =>
    usePatchStatusSelect(patchBuildVariants, versionId, childVersion)
  );
  act(() => {
    result.current[3][versionId].setPatchStatusFilterTerm({
      mainVersion: ["success"],
    });
  });
  expect(result.current[0][versionId]).toEqual(successStatusIds);
  act(() => {
    result.current[3][versionId].setPatchStatusFilterTerm({});
  });
  expect(result.current[0][versionId]).toStrictEqual({ ...allFalse });
});

test("selecting multiple patch statuses should select all tasks with a matching status", () => {
  const { result } = renderHook(() =>
    usePatchStatusSelect(patchBuildVariants, versionId, childVersion)
  );
  act(() => {
    result.current[3][versionId].setPatchStatusFilterTerm({
      mainVersion: ["success", "failed"],
    });
  });
  expect(result.current[0][versionId]).toEqual({
    ...allTrue,
    evergreen_ubuntu1604_89: false,
  });
});

test("selecting an individual task should work", () => {
  const { result } = renderHook(() =>
    usePatchStatusSelect(patchBuildVariants, versionId, childVersion)
  );
  act(() => {
    result.current[3][versionId].toggleSelectedTask({
      mainVersion: "evergreen_lint_generate_lint",
    });
  });
  expect(result.current[0][versionId]).toEqual({
    ...allFalse,
    evergreen_lint_generate_lint: true,
  });
});

test("deselecting an individual task should work if it was selected by valid statuses", () => {
  const { result } = renderHook(() =>
    usePatchStatusSelect(patchBuildVariants, versionId, childVersion)
  );
  act(() => {
    result.current[3][versionId].setPatchStatusFilterTerm({
      mainVersion: ["success"],
    });
  });
  expect(result.current[0][versionId]).toEqual(successStatusIds);
  act(() => {
    result.current[3][versionId].toggleSelectedTask({
      mainVersion: "evergreen_lint_generate_lint",
    });
  });
  expect(result.current[0][versionId]).toEqual({
    ...allTrue,
    evergreen_lint_generate_lint: false,
    evergreen_ubuntu1604_89: false,
    evergreen_ubuntu1604_test_service: false,
  });
});

test("batch toggling tasks will set them all to checked when they are orignially unchecked", () => {
  const { result } = renderHook(() =>
    usePatchStatusSelect(patchBuildVariants, versionId, childVersion)
  );
  waitFor(() =>
    expect(result.current[0][versionId]).toStrictEqual({ ...allFalse })
  );
  act(() =>
    result.current[3][versionId].toggleSelectedTask({
      mainVersion: Object.keys(allFalse),
    })
  );
  waitFor(() =>
    expect(result.current[0][versionId]).toStrictEqual({ ...allTrue })
  );
});

test("batch toggling tasks will set them all to checked when some and not all are originally checked.", () => {
  const { result } = renderHook(() =>
    usePatchStatusSelect(patchBuildVariants, versionId, childVersion)
  );
  waitFor(() => expect(result.current[0]).toStrictEqual({ ...allFalse }));
  act(() =>
    result.current[3][versionId].toggleSelectedTask({
      mainVersion: "evergreen_lint_generate_lint",
    })
  );
  waitFor(() =>
    expect(result.current[0][versionId]).toStrictEqual({
      ...allFalse,
      evergreen_lint_generate_lint: true,
    })
  );
  act(() =>
    result.current[3][versionId].toggleSelectedTask({
      mainVersion: Object.keys(allFalse),
    })
  );
  waitFor(() =>
    expect(result.current[0][versionId]).toStrictEqual({ ...allTrue })
  );
});

test("batch toggling tasks will set them all to unchecked when they are all originally checked.", () => {
  const { result } = renderHook(() =>
    usePatchStatusSelect(patchBuildVariants, versionId, childVersion)
  );
  waitFor(() =>
    expect(result.current[0][versionId]).toStrictEqual({ ...allTrue })
  );
  act(() =>
    result.current[3][versionId].toggleSelectedTask({
      mainVersion: Object.keys(allTrue),
    })
  );
  waitFor(() =>
    expect(result.current[0][versionId]).toStrictEqual({ ...allFalse })
  );
});

const patchBuildVariants = [
  {
    variant: "lint",
    displayName: "Lint",
    tasks: [
      {
        id: "evergreen_lint_generate_lint",
        execution: 0,
        displayName: "generate-lint",
        status: "success",
      },
      {
        id: "evergreen_lint_lint_service",
        execution: 0,
        displayName: "lint-service",
        status: "success",
      },
    ],
  },
  {
    variant: "ubuntu1604",
    displayName: "Ubuntu 16.04",
    tasks: [
      {
        id: "evergreen_ubuntu1604_js_test",
        execution: 0,
        displayName: "js-test",
        status: "success",
      },
      {
        id: "evergreen_ubuntu1604_test_model_distro",
        execution: 0,
        displayName: "test-model-distro",
        status: "success",
      },
      {
        id: "evergreen_ubuntu1604_test_model_event",
        execution: 0,
        displayName: "test-model-event",
        status: "success",
      },
      {
        id: "evergreen_ubuntu1604_test_model_grid",
        execution: 0,
        displayName: "test-model-grid",
        status: "success",
      },
      {
        id: "evergreen_ubuntu1604_test_model_host",
        execution: 0,
        displayName: "test-model-host",
        status: "success",
      },
      {
        id: "evergreen_ubuntu1604_test_service",
        execution: 0,
        displayName: "test-service",
        status: "failed",
        baseStatus: "success",
      },
    ],
  },
  {
    variant: "variant",
    displayName: "Variant",
    tasks: [
      {
        id: "evergreen_ubuntu1604_89",
        execution: 0,
        displayName: "test-thirdparty",
        status: "started",
      },
    ],
  },
];

const versionId = "mainVersion";
const childVersion = [
  {
    id: "childVersionId",
    projectIdentifier: "childProjectIdentifier",
    buildVariants: patchBuildVariants,
  },
];

const successStatusIds = {
  evergreen_lint_generate_lint: true,
  evergreen_lint_lint_service: true,
  evergreen_ubuntu1604_89: false,
  evergreen_ubuntu1604_js_test: true,
  evergreen_ubuntu1604_test_model_distro: true,
  evergreen_ubuntu1604_test_model_event: true,
  evergreen_ubuntu1604_test_model_grid: true,
  evergreen_ubuntu1604_test_model_host: true,
  evergreen_ubuntu1604_test_service: false,
};
