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
  repoData?: FormState;
  useRepoSettings: boolean;
};
