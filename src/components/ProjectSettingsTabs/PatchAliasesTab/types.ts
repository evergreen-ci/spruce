import { ProjectAlias } from "gql/generated/types";
import { ProjectType } from "../utils";

export interface FormState {
  patchAliases: {
    aliasesOverride: boolean;
    aliases: Array<{ initialAlias: string } & ProjectAlias>;
  };
}

export type TabProps = {
  projectData?: FormState;
  projectType: ProjectType;
  repoData?: FormState;
};
