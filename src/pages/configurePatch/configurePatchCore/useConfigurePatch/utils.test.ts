import { initializeAliasState, initializeTaskState } from "./utils";

describe("initializeTaskState", () => {
  it("should return an object with variant tasks", () => {
    let projectBuildVariants = [
      {
        displayName: "Variant 1",
        name: "variant1",
        tasks: ["task1", "task2"],
      },
    ];
    expect(initializeTaskState(projectBuildVariants, [])).toStrictEqual({
      variant1: {
        task1: false,
        task2: false,
      },
    });
    projectBuildVariants = [
      {
        displayName: "Variant 1",
        name: "variant1",
        tasks: ["task1", "task2"],
      },
      {
        displayName: "Variant 2",
        name: "variant2",
        tasks: ["task3", "task4"],
      },
    ];
    expect(initializeTaskState(projectBuildVariants, [])).toStrictEqual({
      variant1: {
        task1: false,
        task2: false,
      },
      variant2: {
        task3: false,
        task4: false,
      },
    });
  });
  it("should auto select default tasks", () => {
    const projectBuildVariants = [
      {
        displayName: "Variant 1",
        name: "variant1",
        tasks: ["task1", "task2"],
      },
    ];
    expect(
      initializeTaskState(projectBuildVariants, [
        {
          name: "variant1",
          tasks: ["task1"],
        },
      ]),
    ).toStrictEqual({
      variant1: {
        task1: true,
        task2: false,
      },
    });
  });
  it("should ensure tasks are not auto selected if they are not in the variant", () => {
    const projectBuildVariants = [
      {
        displayName: "Variant 1",
        name: "variant1",
        tasks: ["task1", "task2"],
      },
      {
        displayName: "Variant 2",
        name: "variant2",
        tasks: ["task1", "task2"],
      },
    ];
    expect(
      initializeTaskState(projectBuildVariants, [
        {
          name: "variant2",
          tasks: ["task2"],
        },
      ]),
    ).toStrictEqual({
      variant1: {
        task1: false,
        task2: false,
      },
      variant2: {
        task1: false,
        task2: true,
      },
    });
  });
});

describe("initializeAliasState", () => {
  it("should not return an object with aliases if there are no aliases", () => {
    const patchTriggerAliases = [];
    expect(initializeAliasState(patchTriggerAliases)).toStrictEqual({});
  });
  it("should return an object with aliases", () => {
    const patchTriggerAliases = [
      {
        alias: "alias1",
        id: "alias1",
        childProjectId: "childProjectId",
        childProjectIdentifier: "childProjectIdentifier",
        variantsTasks: [
          {
            name: "variant1",
            tasks: ["task1"],
          },
        ],
      },
    ];
    expect(initializeAliasState(patchTriggerAliases)).toStrictEqual({
      alias1: false,
    });
  });
});
