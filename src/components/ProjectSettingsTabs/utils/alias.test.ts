import { AliasNames, transformAliases } from "./alias";

describe("transformAliases", () => {
  it("should return a list of aliases using an AliasName if provided", () => {
    expect(
      transformAliases(
        [
          {
            id: "123",
            variant: ".*",
            task: ".*",
          },
        ],
        true,
        AliasNames.GithubPr
      )
    ).toStrictEqual([
      {
        id: "123",
        alias: "__github",
        variantTags: [],
        taskTags: [],
        variant: ".*",
        task: ".*",
        gitTag: "",
        remotePath: "",
      },
    ]);
  });

  it("should return an empty array if override is false", () => {
    expect(
      transformAliases(
        [
          {
            id: "123",
            variantTags: ["new"],
            taskTags: ["test"],
          },
        ],
        false,
        AliasNames.GithubPr
      )
    ).toStrictEqual([]);
  });

  it("should filter out empty tag entries", () => {
    expect(
      transformAliases(
        [
          {
            id: "456",
            variantTags: ["new", "", ""],
            taskTags: ["test"],
          },
        ],
        true,
        AliasNames.CommitQueue
      )
    ).toStrictEqual([
      {
        id: "456",
        alias: "__commit_queue",
        variantTags: ["new"],
        taskTags: ["test"],
        variant: "",
        task: "",
        gitTag: "",
        remotePath: "",
      },
    ]);
  });

  it("uses a custom alias if one is provided", () => {
    expect(
      transformAliases(
        [
          {
            id: "",
            alias: "myAlias",
            variantTags: ["hello"],
            taskTags: ["goodbye"],
          },
        ],
        true
      )
    ).toStrictEqual([
      {
        id: "",
        alias: "myAlias",
        variantTags: ["hello"],
        taskTags: ["goodbye"],
        variant: "",
        task: "",
        gitTag: "",
        remotePath: "",
      },
    ]);
  });
});
