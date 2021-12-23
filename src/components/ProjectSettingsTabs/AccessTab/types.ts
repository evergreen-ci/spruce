import { FormDataProps } from "components/SpruceForm";

export interface FormState extends FormDataProps {
  accessSettings: {
    private: boolean | null;
    restricted: boolean | null;
  };
  admin: {
    admins: Array<{
      username: string;
    }> | null;
  };
}

export type TabProps = {
  projectData?: FormState;
  repoData?: FormState;
  useRepoSettings: boolean;
};
