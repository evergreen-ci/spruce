import { AliasFormType, ProjectType } from "../utils";

export enum TaskSpecifier {
  PatchAlias = "PATCH_ALIAS",
  VariantTask = "VARIANT_TASK",
}

type PatchTriggerAlias = {
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
};

export interface PatchAliasesFormState {
  patchAliases: {
    aliasesOverride: boolean;
    aliases: AliasFormType[];
    repoData?: {
      aliasesOverride: boolean;
      aliases: AliasFormType[];
    };
  };
  patchTriggerAliases: {
    aliasesOverride: boolean;
    aliases: Array<PatchTriggerAlias>;
    repoData?: {
      aliasesOverride: boolean;
      aliases: Array<PatchTriggerAlias>;
    };
  };
}

export type TabProps = {
  projectData?: PatchAliasesFormState;
  projectType: ProjectType;
  repoData?: PatchAliasesFormState;
};
