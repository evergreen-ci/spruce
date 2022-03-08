import { AliasFormType, ProjectType } from "../utils";

export interface FormState {
  patchAliases: {
    aliasesOverride: boolean;
    aliases: AliasFormType[];
  };
}

export type TabProps = {
  projectData?: FormState;
  projectType: ProjectType;
  repoData?: FormState;
};
