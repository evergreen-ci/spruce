export interface FormState {
  buildBreakSettings: {
    notifyOnBuildFailure: boolean | null;
  };
}

export type TabProps = {
  projectData?: FormState;
  repoData?: FormState;
  id?: string;
};
