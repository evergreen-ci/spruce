import { AliasFormType, ProjectType } from "../utils";

export enum TaskSpecifier {
  PatchAlias = "PATCH_ALIAS",
  VariantTask = "VARIANT_TASK",
}

export interface FormState {
  patchAliases: {
    aliasesOverride: boolean;
    aliases: AliasFormType[];
  };
  patchTriggerAliases: {
    aliasesOverride: boolean;
    aliases: Array<{
      alias: string;
      childProjectIdentifier: string;
      displayTitle?: string;
      taskSpecifiers: Array<{
        patchAlias: string;
        specifier: TaskSpecifier;
        taskRegex: string;
        variantRegex: string;
      }>;
      status: string;
      parentAsModule: string;
      isGithubTriggerAlias: boolean;
    }>;
  };
}

export type TabProps = {
  projectData?: FormState;
  projectType: ProjectType;
  repoData?: FormState;
};
