import { string } from "utils";
import { AliasFormType, ProjectType } from "../utils";

const { joinWithConjunction } = string;

enum ErrorType {
  Error,
  Warning,
  None,
}

const getErrorStyle = (
  errorType: ErrorType,
  versionControlEnabled: boolean,
  projectType: ProjectType,
  fieldName: string
): { "ui:warnings": string[] } | { "ui:errors": string[] } | {} => {
  if (errorType === ErrorType.Warning) {
    const definitionLocations =
      projectType === ProjectType.Repo ? ["repo"] : ["project"];
    if (projectType === ProjectType.AttachedProject) {
      definitionLocations.push("repo");
    }
    if (versionControlEnabled) {
      definitionLocations.push("Evergreen configuration file");
    }

    return {
      "ui:warnings": [
        `This feature will only run if a ${fieldName} is defined in the ${joinWithConjunction(
          definitionLocations,
          "or"
        )}.`,
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

export const sectionHasError = (
  versionControlEnabled: boolean,
  projectType: ProjectType
) => (
  override: boolean,
  aliases: Array<AliasFormType>,
  repoAliases: Array<AliasFormType>,
  fieldName: string
): ReturnType<typeof getErrorStyle> => {
  let errorType = ErrorType.None;
  switch (projectType) {
    case ProjectType.AttachedProject:
      if (override && !aliases?.length) {
        if (versionControlEnabled) {
          errorType = ErrorType.Warning;
        } else {
          errorType = ErrorType.Error;
        }
      } else if (!override && !repoAliases?.length) {
        errorType = ErrorType.Warning;
      }
      break;
    default:
      if (!aliases?.length) {
        if (versionControlEnabled) {
          errorType = ErrorType.Warning;
        } else {
          errorType = ErrorType.Error;
        }
      }
  }
  return getErrorStyle(
    errorType,
    versionControlEnabled,
    projectType,
    fieldName
  );
};
