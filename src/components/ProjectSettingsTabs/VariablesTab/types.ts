import { FormDataProps } from "components/SpruceForm";

export interface FormState extends FormDataProps {
  vars: Array<{
    name: string;
    value: string;
    private: boolean;
  }>;
}

export type TabProps = {
  projectData?: FormState;
  repoData?: FormState;
  useRepoSettings: boolean;
};
