import { AliasFormType, ProjectType } from "../utils";

export enum TaskSpecifiers {
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
      taskSpecifiers: Array<{
        patchAlias: string;
        specifier: TaskSpecifiers;
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
