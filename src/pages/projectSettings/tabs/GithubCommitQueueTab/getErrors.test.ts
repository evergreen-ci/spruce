import { AliasFormType, ProjectType } from "../utils";
import { sectionHasError } from "./getErrors";

const callSectionHasError = ({
  aliases,
  enabled,
  override,
  projectType,
  repoAliases,
  versionControlEnabled,
}) =>
  sectionHasError(versionControlEnabled, projectType)(
    enabled,
    override,
    aliases,
    repoAliases,
    "myFieldName",
  );

describe("an attached project", () => {
  const baseArgs = {
    versionControlEnabled: true,
    projectType: ProjectType.AttachedProject,
    enabled: true,
    override: true,
    aliases: [],
    repoAliases: [],
  };

  describe("when aliases are not defined for the project", () => {
    it("returns a warning when version config is enabled", () => {
      expect(callSectionHasError(baseArgs)).toStrictEqual({
        "ui:warnings": [
          "YAML aliases will be used for this feature unless a myFieldName is added to the project or repo.",
        ],
      });
    });

    it("returns an error when version config is not enabled", () => {
      expect(
        callSectionHasError({
          ...baseArgs,
          versionControlEnabled: false,
        }),
      ).toStrictEqual({
        "ui:errors": [
          "A myFieldName must be specified for this feature to run.",
        ],
      });
    });
  });

  describe("when aliases are defined for the project", () => {
    it("returns an empty object", () => {
      expect(
        callSectionHasError({
          ...baseArgs,
          aliases: [{} as AliasFormType],
        }),
      ).toStrictEqual({});
    });
  });

  describe("when aliases are not defined for the project or repo", () => {
    it("returns a warning when version config is enabled", () => {
      expect(
        callSectionHasError({
          ...baseArgs,
          override: false,
        }),
      ).toStrictEqual({
        "ui:warnings": [
          "YAML aliases will be used for this feature unless a myFieldName is added to the project or repo.",
        ],
      });
    });

    it("returns a warning when version config is not enabled", () => {
      expect(
        callSectionHasError({
          ...baseArgs,
          versionControlEnabled: false,
          override: false,
        }),
      ).toStrictEqual({
        "ui:warnings": [
          "This feature will only run if a myFieldName is defined in the project or repo.",
        ],
      });
    });
  });

  it("returns no error when the project is disabled", () => {
    expect(
      callSectionHasError({
        ...baseArgs,
        enabled: false,
      }),
    ).toStrictEqual({});
  });
});

describe("a repo", () => {
  const baseArgs = {
    versionControlEnabled: true,
    projectType: ProjectType.Repo,
    enabled: true,
    override: true,
    aliases: [],
    repoAliases: [],
  };

  it("returns an empty object when an alias is defined", () => {
    expect(
      callSectionHasError({
        ...baseArgs,
        aliases: [{} as AliasFormType],
      }),
    ).toStrictEqual({});
  });

  describe("when an alias is not defined", () => {
    it("returns a warning when version control is enabled", () => {
      expect(callSectionHasError(baseArgs)).toStrictEqual({
        "ui:warnings": [
          "YAML aliases will be used for this feature unless a myFieldName is added to the repo.",
        ],
      });
    });

    it("returns an error when version control is not enabled", () => {
      expect(
        callSectionHasError({
          ...baseArgs,
          versionControlEnabled: false,
        }),
      ).toStrictEqual({
        "ui:errors": [
          "A myFieldName must be specified for this feature to run.",
        ],
      });
    });
  });
});
