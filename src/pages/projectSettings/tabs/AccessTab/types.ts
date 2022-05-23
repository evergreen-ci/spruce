import { ProjectType } from "../utils";

export interface FormState {
  accessSettings: {
    private: boolean | null;
    restricted: boolean | null;
  };
  admin: {
    admins: string[];
  };
}

export type TabProps = {
  projectData?: FormState;
  projectType: ProjectType;
  repoData?: FormState;
};
