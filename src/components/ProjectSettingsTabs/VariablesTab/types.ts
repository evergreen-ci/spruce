import { FormDataProps } from "components/SpruceForm";

export interface FormState extends FormDataProps {
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
