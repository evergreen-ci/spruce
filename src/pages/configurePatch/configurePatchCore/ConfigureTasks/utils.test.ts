import { CheckboxState } from "./types";
import {
  deduplicateTasks,
  getSelectAllCheckboxState,
  getVisibleAliases,
  getVisibleChildPatches,
} from "./utils";

describe("deduplicateTasks", () => {
  it("should print all tasks for one variant", () => {
    const tasks = [{ task1: false, task2: false }];
    expect(deduplicateTasks(tasks)).toStrictEqual({
      task1: CheckboxState.UNCHECKED,
      task2: CheckboxState.UNCHECKED,
    });
  });
  it("should print all tasks for multiple variants", () => {
    const tasks = [
      { task1: false, task2: false },
      { task3: false, task4: true },
    ];
    expect(deduplicateTasks(tasks)).toStrictEqual({
      task1: CheckboxState.UNCHECKED,
      task2: CheckboxState.UNCHECKED,
      task3: CheckboxState.UNCHECKED,
      task4: CheckboxState.CHECKED,
    });
  });
  it("should deduplicate tasks across multiple variants", () => {
    const tasks = [
      { task1: false, task2: false },
      { task2: false, task3: false },
    ];
    expect(deduplicateTasks(tasks)).toStrictEqual({
      task1: CheckboxState.UNCHECKED,
      task2: CheckboxState.UNCHECKED,
      task3: CheckboxState.UNCHECKED,
    });
  });
  it("should deduplicate tasks across multiple variants with different states", () => {
    const tasks = [
      { task1: false, task2: false },
      { task2: true, task3: false },
    ];
    expect(deduplicateTasks(tasks)).toStrictEqual({
      task1: CheckboxState.UNCHECKED,
      task2: CheckboxState.INDETERMINATE,
      task3: CheckboxState.UNCHECKED,
    });
  });
});

describe("getSelectAllCheckboxState", () => {
  it("should return checked if all tasks are checked", () => {
    const tasks = {
      task1: CheckboxState.CHECKED,
      task2: CheckboxState.CHECKED,
    };
    expect(getSelectAllCheckboxState(tasks, {}, false)).toStrictEqual(
      CheckboxState.CHECKED
    );
  });
  it("should return unchecked if all tasks are unchecked", () => {
    const tasks = {
      task1: CheckboxState.UNCHECKED,
      task2: CheckboxState.UNCHECKED,
    };
    expect(getSelectAllCheckboxState(tasks, {}, false)).toStrictEqual(
      CheckboxState.UNCHECKED
    );
  });
  it("should return indeterminate if some tasks are checked", () => {
    const tasks = {
      task1: CheckboxState.CHECKED,
      task2: CheckboxState.UNCHECKED,
    };
    expect(getSelectAllCheckboxState(tasks, {}, false)).toStrictEqual(
      CheckboxState.INDETERMINATE
    );
  });
  it("should return checked if all aliases are checked", () => {
    const aliases = {
      alias1: CheckboxState.CHECKED,
      alias2: CheckboxState.CHECKED,
    };
    expect(getSelectAllCheckboxState({}, aliases, false)).toStrictEqual(
      CheckboxState.CHECKED
    );
  });
  it("should return unchecked if all aliases are unchecked", () => {
    const aliases = {
      alias1: CheckboxState.UNCHECKED,
      alias2: CheckboxState.UNCHECKED,
    };
    expect(getSelectAllCheckboxState({}, aliases, false)).toStrictEqual(
      CheckboxState.UNCHECKED
    );
  });
  it("should return indeterminate if some aliases are checked", () => {
    const aliases = {
      alias1: CheckboxState.CHECKED,
      alias2: CheckboxState.UNCHECKED,
    };
    expect(getSelectAllCheckboxState({}, aliases, false)).toStrictEqual(
      CheckboxState.INDETERMINATE
    );
  });
  it("should return checked if all tasks and aliases are checked", () => {
    const tasks = {
      task1: CheckboxState.CHECKED,
      task2: CheckboxState.CHECKED,
    };
    const aliases = {
      alias1: CheckboxState.CHECKED,
      alias2: CheckboxState.CHECKED,
    };
    expect(getSelectAllCheckboxState(tasks, aliases, false)).toStrictEqual(
      CheckboxState.CHECKED
    );
  });
  it("should return unchecked if all tasks and aliases are unchecked", () => {
    const tasks = {
      task1: CheckboxState.UNCHECKED,
      task2: CheckboxState.UNCHECKED,
    };
    const aliases = {
      alias1: CheckboxState.UNCHECKED,
      alias2: CheckboxState.UNCHECKED,
    };
    expect(getSelectAllCheckboxState(tasks, aliases, false)).toStrictEqual(
      CheckboxState.UNCHECKED
    );
  });
  it("should return indeterminate if some tasks and aliases are checked", () => {
    const tasks = {
      task1: CheckboxState.CHECKED,
      task2: CheckboxState.UNCHECKED,
    };
    const aliases = {
      alias1: CheckboxState.CHECKED,
      alias2: CheckboxState.UNCHECKED,
    };
    expect(getSelectAllCheckboxState(tasks, aliases, false)).toStrictEqual(
      CheckboxState.INDETERMINATE
    );
  });
  it("should be checked by default if a child patch is selected", () => {
    const tasks = {
      task1: CheckboxState.CHECKED,
      task2: CheckboxState.UNCHECKED,
    };
    const aliases = {
      alias1: CheckboxState.CHECKED,
      alias2: CheckboxState.UNCHECKED,
    };
    expect(getSelectAllCheckboxState(tasks, aliases, true)).toStrictEqual(
      CheckboxState.CHECKED
    );
  });
});

describe("getVisibleAliases", () => {
  it("should not return aliases that are not selected", () => {
    const aliases = {
      alias1: true,
      alias2: false,
    };
    expect(getVisibleAliases(aliases, [])).toStrictEqual({});
  });
  it("should return aliases that are selected", () => {
    let aliases = {
      alias1: true,
      alias2: false,
    };
    expect(getVisibleAliases(aliases, ["alias1"])).toStrictEqual({
      alias1: CheckboxState.CHECKED,
    });
    aliases = {
      alias1: false,
      alias2: false,
    };
    expect(getVisibleAliases(aliases, ["alias1"])).toStrictEqual({
      alias1: CheckboxState.UNCHECKED,
    });
  });
});

describe("getVisibleChildPatches", () => {
  it("should not return any child patches if none exist", () => {
    expect(getVisibleChildPatches([], [])).toStrictEqual([]);
  });
  it("should not return any child patches if they are not selected", () => {
    const childPatches = [
      {
        id: "childPatch1",
        alias: "alias1",
        projectIdentifier: "project1",
        variantsTasks: [],
      },
    ];
    expect(getVisibleChildPatches(childPatches, [])).toStrictEqual([]);
  });
  it("should return child patches that are selected", () => {
    const childPatch1 = {
      id: "childPatch1",
      alias: "alias1",
      projectIdentifier: "project1",
      variantsTasks: [],
    };
    const childPatch2 = {
      id: "childPatch2",
      alias: "alias2",
      projectIdentifier: "project2",
      variantsTasks: [],
    };
    const childPatches = [childPatch1, childPatch2];
    expect(getVisibleChildPatches(childPatches, ["alias1"])).toStrictEqual([
      childPatch1,
    ]);
  });
});
