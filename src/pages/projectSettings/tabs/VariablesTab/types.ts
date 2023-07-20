import { ProjectType } from "../utils";

export interface VariablesFormState {
  vars: Array<{
    varName: string;
    varValue: string;
    isPrivate: boolean;
    isAdminOnly: boolean;
    isDisabled: boolean;
  }>;
}

export type TabProps = {
  identifier: string;
  projectData?: VariablesFormState;
  projectType: ProjectType;
  repoData?: VariablesFormState;
};
