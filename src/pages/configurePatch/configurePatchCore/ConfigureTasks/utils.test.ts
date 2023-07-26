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
    expect(deduplicateTasks(tasks, [], "")).toStrictEqual({
      task1: {
        activated: false,
        checkboxState: CheckboxState.Unchecked,
      },
      task2: {
        activated: false,
        checkboxState: CheckboxState.Unchecked,
      },
    });
  });
  it("should print all tasks for multiple variants", () => {
    const tasks = [
      { task1: false, task2: false },
      { task3: false, task4: true },
    ];
    expect(deduplicateTasks(tasks, [], "")).toStrictEqual({
      task1: {
        activated: false,
        checkboxState: CheckboxState.Unchecked,
      },
      task2: {
        activated: false,
        checkboxState: CheckboxState.Unchecked,
      },
      task3: {
        activated: false,
        checkboxState: CheckboxState.Unchecked,
      },
      task4: {
        activated: false,
        checkboxState: CheckboxState.Checked,
      },
    });
  });
  it("should deduplicate tasks across multiple variants", () => {
    const tasks = [
      { task1: false, task2: false },
      { task2: false, task3: false },
    ];
    expect(deduplicateTasks(tasks, [], "")).toStrictEqual({
      task1: {
        activated: false,
        checkboxState: CheckboxState.Unchecked,
      },
      task2: {
        activated: false,
        checkboxState: CheckboxState.Unchecked,
      },
      task3: {
        activated: false,
        checkboxState: CheckboxState.Unchecked,
      },
    });
  });
  it("should deduplicate tasks across multiple variants with different states", () => {
    const tasks = [
      { task1: false, task2: false },
      { task2: true, task3: false },
    ];
    expect(deduplicateTasks(tasks, [], "")).toStrictEqual({
      task1: {
        activated: false,
        checkboxState: CheckboxState.Unchecked,
      },
      task2: {
        activated: false,
        checkboxState: CheckboxState.Indeterminate,
      },
      task3: {
        activated: false,
        checkboxState: CheckboxState.Unchecked,
      },
    });
  });
  it("should disable tasks that have been already activated", () => {
    const tasks = [
      { task1: true, task2: false },
      { task2: true, task3: false },
    ];
    const previouslyActivatedBuildvariants = [
      { name: "variant1", tasks: ["task1"] },
      { name: "variant2", tasks: ["task3"] },
    ];
    expect(
      deduplicateTasks(tasks, previouslyActivatedBuildvariants, "")
    ).toStrictEqual({
      task1: {
        activated: true,
        checkboxState: CheckboxState.Checked,
      },
      task2: {
        activated: false,
        checkboxState: CheckboxState.Indeterminate,
      },
      task3: {
        activated: true,
        checkboxState: CheckboxState.Unchecked,
      },
    });
  });
  it("should filter tasks out that do not match the filterTerm", () => {
    const tasks = [
      { task1: false, task2: false },
      { task2: false, task3: false },
    ];
    expect(deduplicateTasks(tasks, [], "task1")).toStrictEqual({
      task1: {
        activated: false,
        checkboxState: CheckboxState.Unchecked,
      },
    });
  });
});

describe("getSelectAllCheckboxState", () => {
  it("should return checked if all tasks are checked", () => {
    const tasks = {
      task1: {
        activated: false,
        checkboxState: CheckboxState.Checked,
      },
      task2: { activated: false, checkboxState: CheckboxState.Checked },
    };
    expect(getSelectAllCheckboxState(tasks, {}, false)).toStrictEqual(
      CheckboxState.Checked
    );
  });
  it("should return unchecked if all tasks are unchecked", () => {
    const tasks = {
      task1: {
        activated: false,
        checkboxState: CheckboxState.Unchecked,
      },
      task2: { activated: false, checkboxState: CheckboxState.Unchecked },
    };
    expect(getSelectAllCheckboxState(tasks, {}, false)).toStrictEqual(
      CheckboxState.Unchecked
    );
  });
  it("should return indeterminate if some tasks are checked and unchecked", () => {
    const tasks = {
      task1: {
        activated: false,
        checkboxState: CheckboxState.Checked,
      },
      task2: { activated: false, checkboxState: CheckboxState.Unchecked },
    };
    expect(getSelectAllCheckboxState(tasks, {}, false)).toStrictEqual(
      CheckboxState.Indeterminate
    );
  });
  it("should return indeterminate if some tasks are indeterminate", () => {
    const tasks = {
      task1: {
        activated: false,
        checkboxState: CheckboxState.Checked,
      },
      task2: { activated: false, checkboxState: CheckboxState.Indeterminate },
    };
    expect(getSelectAllCheckboxState(tasks, {}, false)).toStrictEqual(
      CheckboxState.Indeterminate
    );
  });
  it("should return checked if all aliases are checked", () => {
    const aliases = {
      alias1: CheckboxState.Checked,
      alias2: CheckboxState.Checked,
    };
    expect(getSelectAllCheckboxState({}, aliases, false)).toStrictEqual(
      CheckboxState.Checked
    );
  });
  it("should return unchecked if all aliases are unchecked", () => {
    const aliases = {
      alias1: CheckboxState.Unchecked,
      alias2: CheckboxState.Unchecked,
    };
    expect(getSelectAllCheckboxState({}, aliases, false)).toStrictEqual(
      CheckboxState.Unchecked
    );
  });
  it("should return indeterminate if some aliases are checked", () => {
    const aliases = {
      alias1: CheckboxState.Checked,
      alias2: CheckboxState.Unchecked,
    };
    expect(getSelectAllCheckboxState({}, aliases, false)).toStrictEqual(
      CheckboxState.Indeterminate
    );
  });
  it("should return checked if all tasks and aliases are checked", () => {
    const tasks = {
      task1: {
        activated: false,
        checkboxState: CheckboxState.Checked,
      },
      task2: {
        activated: false,
        checkboxState: CheckboxState.Checked,
      },
    };
    const aliases = {
      alias1: CheckboxState.Checked,
      alias2: CheckboxState.Checked,
    };
    expect(getSelectAllCheckboxState(tasks, aliases, false)).toStrictEqual(
      CheckboxState.Checked
    );
  });
  it("should return unchecked if all tasks and aliases are unchecked", () => {
    const tasks = {
      task1: {
        activated: false,
        checkboxState: CheckboxState.Unchecked,
      },
      task2: {
        activated: false,
        checkboxState: CheckboxState.Unchecked,
      },
    };
    const aliases = {
      alias1: CheckboxState.Unchecked,
      alias2: CheckboxState.Unchecked,
    };
    expect(getSelectAllCheckboxState(tasks, aliases, false)).toStrictEqual(
      CheckboxState.Unchecked
    );
  });
  it("should return indeterminate if some tasks and aliases are checked", () => {
    const tasks = {
      task1: {
        activated: false,
        checkboxState: CheckboxState.Unchecked,
      },
      task2: {
        activated: false,
        checkboxState: CheckboxState.Checked,
      },
    };
    const aliases = {
      alias1: CheckboxState.Checked,
      alias2: CheckboxState.Unchecked,
    };
    expect(getSelectAllCheckboxState(tasks, aliases, false)).toStrictEqual(
      CheckboxState.Indeterminate
    );
  });
  it("should be checked by default if a child patch is selected", () => {
    const tasks = {
      task1: {
        activated: false,
        checkboxState: CheckboxState.Checked,
      },
      task2: {
        activated: false,
        checkboxState: CheckboxState.Unchecked,
      },
    };
    const aliases = {
      alias1: CheckboxState.Checked,
      alias2: CheckboxState.Unchecked,
    };
    expect(getSelectAllCheckboxState(tasks, aliases, true)).toStrictEqual(
      CheckboxState.Checked
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
      alias1: CheckboxState.Checked,
    });
    aliases = {
      alias1: false,
      alias2: false,
    };
    expect(getVisibleAliases(aliases, ["alias1"])).toStrictEqual({
      alias1: CheckboxState.Unchecked,
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
        alias: "alias1",
        id: "childPatch1",
        projectIdentifier: "project1",
        variantsTasks: [],
      },
    ];
    expect(getVisibleChildPatches(childPatches, [])).toStrictEqual([]);
  });
  it("should return child patches that are selected", () => {
    const childPatch1 = {
      alias: "alias1",
      id: "childPatch1",
      projectIdentifier: "project1",
      variantsTasks: [],
    };
    const childPatch2 = {
      alias: "alias2",
      id: "childPatch2",
      projectIdentifier: "project2",
      variantsTasks: [],
    };
    const childPatches = [childPatch1, childPatch2];
    expect(getVisibleChildPatches(childPatches, ["alias1"])).toStrictEqual([
      childPatch1,
    ]);
  });
});
