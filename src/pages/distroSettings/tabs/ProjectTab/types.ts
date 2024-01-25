export interface ProjectFormState {
  expansions: Array<{
    key: string;
    value: string;
  }>;
  validProjects: string[];
}

export type TabProps = {
  distroData: ProjectFormState;
};
