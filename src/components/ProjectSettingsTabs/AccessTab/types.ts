import { ProjectType } from "../utils";

export interface FormState {
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
  projectType: ProjectType;
  repoData?: FormState;
};
