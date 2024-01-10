import { AliasFormType, ProjectType } from "../utils";

export enum ErrorType {
  None,
  Warning,
  Error,
}

const getDefinitionLocation = (projectType: ProjectType) => {
  switch (projectType) {
    case ProjectType.AttachedProject:
      return "project or repo";
    case ProjectType.Repo:
      return "repo";
    case ProjectType.Project:
      return "project";
    default:
      return "project";
  }
};

const getErrorStyle = (
  errorType: ErrorType,
  versionControlEnabled: boolean,
  projectType: ProjectType,
  fieldName: string,
): { "ui:warnings": string[] } | { "ui:errors": string[] } | {} => {
  if (errorType === ErrorType.Warning) {
    const definitionLocation = getDefinitionLocation(projectType);

    if (versionControlEnabled) {
      return {
        "ui:warnings": [
          `YAML aliases will be used for this feature unless a ${fieldName} is added to the ${definitionLocation}.`,
        ],
      };
    }

    return {
      "ui:warnings": [
        `This feature will only run if a ${fieldName} is defined in the ${definitionLocation}.`,
      ],
    };
  }
  if (errorType === ErrorType.Error) {
    return {
      "ui:errors": [
        `A ${fieldName} must be specified for this feature to run.`,
      ],
    };
  }
  return {};
};

export const getVersionControlError =
  (versionControlEnabled: boolean, projectType: ProjectType) =>
  (
    enabled: boolean,
    override: boolean,
    aliases: Array<AliasFormType>,
    repoAliases: Array<AliasFormType>,
  ) => {
    if (enabled === false) {
      return ErrorType.None;
    }

    switch (projectType) {
      case ProjectType.AttachedProject:
        if (override && !aliases?.length) {
          if (versionControlEnabled) {
            return ErrorType.Warning;
          }
          return ErrorType.Error;
        }
        if (!override && !repoAliases?.length) {
          return ErrorType.Warning;
        }
        return ErrorType.None;
      default:
        if (!aliases?.length) {
          if (versionControlEnabled) {
            return ErrorType.Warning;
          }
          return ErrorType.Error;
        }
        return ErrorType.None;
    }
  };

export const sectionHasError =
  (versionControlEnabled: boolean, projectType: ProjectType) =>
  (
    enabled: boolean,
    override: boolean,
    aliases: Array<AliasFormType>,
    repoAliases: Array<AliasFormType>,
    fieldName: string,
  ): ReturnType<typeof getErrorStyle> => {
    const errorType = getVersionControlError(
      versionControlEnabled,
      projectType,
    )(enabled, override, aliases, repoAliases);
    return getErrorStyle(
      errorType,
      versionControlEnabled,
      projectType,
      fieldName,
    );
  };

export const githubConflictErrorStyling = (
  conflictProjects: string[] | null,
  fieldEnabled: boolean | null,
  repoFieldEnabled: boolean,
  fieldName: string,
) => {
  if (!conflictProjects?.length) {
    return {};
  }

  const bannerKey =
    fieldEnabled || (fieldEnabled === null && repoFieldEnabled)
      ? "ui:errors"
      : "ui:warnings";
  return {
    [bannerKey]: [
      `Enabling ${fieldName} would introduce conflicts with the following project(s): ${conflictProjects.join(
        ", ",
      )}. To enable ${fieldName} for this project please disable it elsewhere.`,
    ],
  };
};
