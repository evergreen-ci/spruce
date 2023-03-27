import { ProjectType } from "../utils";

export interface FormState {
  accessSettings: {
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
