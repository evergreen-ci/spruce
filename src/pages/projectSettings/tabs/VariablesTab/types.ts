import { ProjectType } from "../utils";

type Variable = {
  varName: string;
  varValue: string;
  isPrivate: boolean;
  isAdminOnly: boolean;
  isDisabled: boolean;
};

export interface VariablesFormState {
  vars: Array<Variable>;
  repoData?: {
    vars: Array<Variable>;
  };
}

export type TabProps = {
  identifier: string;
  projectData?: VariablesFormState;
  projectType: ProjectType;
  repoData?: VariablesFormState;
};
