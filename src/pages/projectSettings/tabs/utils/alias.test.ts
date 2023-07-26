import {
  AliasFormType,
  AliasNames,
  GitTagSpecifier,
  transformAliases,
  VariantTaskSpecifier,
} from "./alias";

describe("transformAliases", () => {
  it("should return a list of aliases using an AliasName if provided", () => {
    expect(
      transformAliases(
        [
          {
            id: "123",
            tasks: {
              specifier: VariantTaskSpecifier.Regex,
              task: ".*",
              taskTags: ["hello"],
            },
            variants: {
              specifier: VariantTaskSpecifier.Regex,
              variant: ".*",
              variantTags: ["hi"],
            },
          } as AliasFormType,
        ],
        true,
        AliasNames.GithubPr
      )
    ).toStrictEqual([
      {
        alias: "__github",
        description: "",
        gitTag: "",
        id: "123",
        remotePath: "",
        task: ".*",
        taskTags: [],
        variant: ".*",
        variantTags: [],
      },
    ]);
  });

  it("should return an empty array if override is false", () => {
    expect(
      transformAliases(
        [
          {
            id: "123",
          } as AliasFormType,
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
            tasks: {
              specifier: VariantTaskSpecifier.Tags,
              task: "",
              taskTags: ["test"],
            },
            variants: {
              specifier: VariantTaskSpecifier.Tags,
              variant: "something",
              variantTags: ["new", "", ""],
            },
          } as AliasFormType,
        ],
        true,
        AliasNames.CommitQueue
      )
    ).toStrictEqual([
      {
        alias: "__commit_queue",
        description: "",
        gitTag: "",
        id: "456",
        remotePath: "",
        task: "",
        taskTags: ["test"],
        variant: "",
        variantTags: ["new"],
      },
    ]);
  });

  it("uses a custom alias if one is provided", () => {
    expect(
      transformAliases(
        [
          {
            alias: "myAlias",
            description: "myDescription",
            id: "",
            tasks: {
              specifier: VariantTaskSpecifier.Tags,
              task: "",
              taskTags: ["goodbye"],
            },
            variants: {
              specifier: VariantTaskSpecifier.Tags,
              variant: "",
              variantTags: ["hello"],
            },
          } as AliasFormType,
        ],
        true
      )
    ).toStrictEqual([
      {
        alias: "myAlias",
        description: "myDescription",
        gitTag: "",
        id: "",
        remotePath: "",
        task: "",
        taskTags: ["goodbye"],
        variant: "",
        variantTags: ["hello"],
      },
    ]);
  });

  describe("git tag aliases", () => {
    it("correctly uses a config file", () => {
      expect(
        transformAliases(
          [
            {
              gitTag: "test",
              id: "",
              remotePath: "evergreen.yml",
              specifier: GitTagSpecifier.ConfigFile,
              tasks: {
                specifier: VariantTaskSpecifier.Tags,
                task: "",
                taskTags: ["goodbye"],
              },
              variants: {
                specifier: VariantTaskSpecifier.Tags,
                variant: "",
                variantTags: ["hello"],
              },
            } as AliasFormType,
          ],
          true,
          AliasNames.GitTag
        )
      ).toStrictEqual([
        {
          alias: "__git_tag",
          description: "",
          gitTag: "test",
          id: "",
          remotePath: "evergreen.yml",
          task: "",
          taskTags: [],
          variant: "",
          variantTags: [],
        },
      ]);
    });

    it("correctly uses a variant/task pair", () => {
      expect(
        transformAliases(
          [
            {
              gitTag: "test",
              id: "",
              remotePath: "evergreen.yml",
              specifier: GitTagSpecifier.VariantTask,
              tasks: {
                specifier: VariantTaskSpecifier.Tags,
                task: "",
                taskTags: ["goodbye"],
              },
              variants: {
                specifier: VariantTaskSpecifier.Tags,
                variant: "",
                variantTags: ["hello"],
              },
            } as AliasFormType,
          ],
          true,
          AliasNames.GitTag
        )
      ).toStrictEqual([
        {
          alias: "__git_tag",
          description: "",
          gitTag: "test",
          id: "",
          remotePath: "",
          task: "",
          taskTags: ["goodbye"],
          variant: "",
          variantTags: ["hello"],
        },
      ]);
    });
  });
});
