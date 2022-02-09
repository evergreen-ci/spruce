import { FormDataProps } from "components/SpruceForm";

export interface FormState extends FormDataProps {
  buildBreakSettings: {
    notifyOnBuildFailure: boolean | null;
  };
}

export type TabProps = {
  projectData?: FormState;
  repoData?: FormState;
  useRepoSettings: boolean;
  id?: string;
};
