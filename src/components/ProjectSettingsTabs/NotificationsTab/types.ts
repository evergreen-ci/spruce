import { ProjectVariant } from "../utils";

export interface FormState {
  buildBreakSettings: {
    notifyOnBuildFailure: boolean | null;
  };
}

export type TabProps = {
  projectData?: FormState;
  projectVariant: ProjectVariant;
  repoData?: FormState;
  id?: string;
};
