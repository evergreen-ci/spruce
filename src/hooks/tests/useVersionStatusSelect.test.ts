import { useVersionTaskStatusSelect } from "hooks";
import { renderHook, act } from "test_utils";

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
describe("useVersionStatusSelect", () => {
  it("should have no tasks and no valid statuses selected by default", () => {
    const { result } = renderHook(() =>
      useVersionTaskStatusSelect(groupedBuildVariants, versionId, childVersion),
    );
    expect(result.current.selectedTasks[versionId]).toStrictEqual(allFalse);
  });

  it("should select all tasks that match the patch status filter when the base status filter is empty", () => {
    const { result } = renderHook(() =>
      useVersionTaskStatusSelect(groupedBuildVariants, versionId, childVersion),
    );
    act(() => {
      result.current.setVersionStatusFilterTerm({
        mainVersion: ["success"],
      });
    });
    act(() => {
      result.current.setBaseStatusFilterTerm({});
    });
    expect(result.current.selectedTasks[versionId]).toStrictEqual(
      successStatusIds,
    );
  });

  it("should select all tasks that match the base status filter when the patch status filter is empty", () => {
    const { result } = renderHook(() =>
      useVersionTaskStatusSelect(groupedBuildVariants, versionId, childVersion),
    );
    act(() => {
      result.current.setVersionStatusFilterTerm({});
    });
    act(() => {
      result.current.setBaseStatusFilterTerm({
        mainVersion: ["success"],
      });
    });
    expect(result.current.selectedTasks[versionId]).toStrictEqual({
      ...allFalse,
      evergreen_ubuntu1604_test_service: true,
    });
  });

  it("should select all tasks that match the patch status filter and base status filter when both filters have active filter terms.", () => {
    const { result } = renderHook(() =>
      useVersionTaskStatusSelect(groupedBuildVariants, versionId, childVersion),
    );
    act(() => {
      result.current.setVersionStatusFilterTerm({
        mainVersion: ["failed"],
      });
    });
    act(() => {
      result.current.setBaseStatusFilterTerm({
        mainVersion: ["success"],
      });
    });
    expect(result.current.selectedTasks[versionId]).toStrictEqual({
      ...allFalse,
      evergreen_ubuntu1604_test_service: true,
    });
  });

  it("tasks with undefined base statuses do not match with any base status filter state.", () => {
    const { result } = renderHook(() =>
      useVersionTaskStatusSelect(groupedBuildVariants, versionId, childVersion),
    );
    act(() => {
      result.current.setVersionStatusFilterTerm({
        mainVersion: ["success"],
      });
    });
    act(() => {
      result.current.setBaseStatusFilterTerm({
        mainVersion: ["success", "fakeStatus", "random"],
      });
    });
    expect(result.current.selectedTasks[versionId]).toStrictEqual({
      ...allFalse,
    });
  });

  it("should deselect all tasks with statuses that do not match any patch status filter terms.", () => {
    const { result } = renderHook(() =>
      useVersionTaskStatusSelect(groupedBuildVariants, versionId, childVersion),
    );
    act(() => {
      result.current.setVersionStatusFilterTerm({
        mainVersion: ["success"],
      });
    });
    expect(result.current.selectedTasks[versionId]).toStrictEqual(
      successStatusIds,
    );
    act(() => {
      result.current.setVersionStatusFilterTerm({
        mainVersion: [],
      });
    });
    expect(result.current.selectedTasks[versionId]).toStrictEqual({
      ...allFalse,
    });
  });

  it("selecting multiple patch statuses should select all tasks with a matching status", () => {
    const { result } = renderHook(() =>
      useVersionTaskStatusSelect(groupedBuildVariants, versionId, childVersion),
    );
    act(() => {
      result.current.setVersionStatusFilterTerm({
        mainVersion: ["success", "failed"],
      });
    });
    expect(result.current.selectedTasks[versionId]).toStrictEqual({
      ...allTrue,
      evergreen_ubuntu1604_89: false,
    });
  });

  it("selecting an individual task should work", () => {
    const { result } = renderHook(() =>
      useVersionTaskStatusSelect(groupedBuildVariants, versionId, childVersion),
    );
    act(() => {
      result.current.toggleSelectedTask({
        mainVersion: "evergreen_lint_generate_lint",
      });
    });
    expect(result.current.selectedTasks[versionId]).toStrictEqual({
      ...allFalse,
      evergreen_lint_generate_lint: true,
    });
  });

  it("deselecting an individual task should work if it was selected by valid statuses", () => {
    const { result } = renderHook(() =>
      useVersionTaskStatusSelect(groupedBuildVariants, versionId, childVersion),
    );
    act(() => {
      result.current.setVersionStatusFilterTerm({
        mainVersion: ["success"],
      });
    });
    expect(result.current.selectedTasks[versionId]).toStrictEqual(
      successStatusIds,
    );
    act(() => {
      result.current.toggleSelectedTask({
        mainVersion: "evergreen_lint_generate_lint",
      });
    });
    expect(result.current.selectedTasks[versionId]).toStrictEqual({
      ...allTrue,
      evergreen_lint_generate_lint: false,
      evergreen_ubuntu1604_89: false,
      evergreen_ubuntu1604_test_service: false,
    });
  });

  it("batch toggling tasks will set them all to checked when they are originally unchecked", () => {
    const { result } = renderHook(() =>
      useVersionTaskStatusSelect(groupedBuildVariants, versionId, childVersion),
    );
    expect(result.current.selectedTasks[versionId]).toStrictEqual({
      ...allFalse,
    });
    act(() =>
      result.current.toggleSelectedTask({
        mainVersion: Object.keys(allFalse),
      }),
    );
    expect(result.current.selectedTasks[versionId]).toStrictEqual({
      ...allTrue,
    });
  });

  it("batch toggling tasks will set them all to checked when some and not all are originally checked.", () => {
    const { result } = renderHook(() =>
      useVersionTaskStatusSelect(groupedBuildVariants, versionId, childVersion),
    );
    expect(result.current.selectedTasks[versionId]).toStrictEqual({
      ...allFalse,
    });
    act(() =>
      result.current.toggleSelectedTask({
        mainVersion: "evergreen_lint_generate_lint",
      }),
    );
    expect(result.current.selectedTasks[versionId]).toStrictEqual({
      ...allFalse,
      evergreen_lint_generate_lint: true,
    });
    act(() =>
      result.current.toggleSelectedTask({
        mainVersion: Object.keys(allFalse),
      }),
    );
    expect(result.current.selectedTasks[versionId]).toStrictEqual({
      ...allTrue,
    });
  });

  it("batch toggling tasks will set them all to unchecked when they are all originally checked.", () => {
    const { result } = renderHook(() =>
      useVersionTaskStatusSelect(groupedBuildVariants, versionId, childVersion),
    );
    expect(result.current.selectedTasks[versionId]).toStrictEqual({
      ...allFalse,
    });
    act(() =>
      result.current.toggleSelectedTask({
        mainVersion: Object.keys(allFalse),
      }),
    );
    expect(result.current.selectedTasks[versionId]).toStrictEqual({
      ...allTrue,
    });
    act(() =>
      result.current.toggleSelectedTask({
        mainVersion: Object.keys(allFalse),
      }),
    );
    expect(result.current.selectedTasks[versionId]).toStrictEqual({
      ...allFalse,
    });
  });
});

const groupedBuildVariants = [
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
const childVersionId = "childVersionId";
const childVersion = [
  {
    id: childVersionId,
    projectIdentifier: "childProjectIdentifier",
    buildVariants: groupedBuildVariants,
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
