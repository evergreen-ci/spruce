import { ProjectVariant } from "../utils";

export interface FormState {
  vars: Array<{
    varName: string;
    varValue: string;
    isPrivate: boolean;
    isDisabled: boolean;
  }>;
}

export type TabProps = {
  projectData?: FormState;
  projectVariant: ProjectVariant;
  repoData?: FormState;
};
