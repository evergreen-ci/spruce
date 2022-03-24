import { ProjectType } from "../utils";

export interface FormState {
  buildBreakSettings: {
    notifyOnBuildFailure: boolean | null;
  };
}

export type TabProps = {
  projectData?: FormState;
  projectType: ProjectType;
  repoData?: FormState;
  id?: string;
};
