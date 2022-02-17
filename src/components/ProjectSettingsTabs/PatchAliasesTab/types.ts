import { AliasType } from "../utils";

export interface FormState {
  patchAliases: {
    aliasesOverride: boolean;
    aliases: Array<{ initialAlias: string } & AliasType>;
  };
}

export type TabProps = {
  projectData?: FormState;
  repoData?: FormState;
  useRepoSettings: boolean;
};
