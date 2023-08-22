import { ProjectType } from "../utils";

export interface AccessFormState {
  accessSettings: {
    restricted: boolean | null;
  };
  admin: {
    admins: string[];
  };
}

export type TabProps = {
  projectData?: AccessFormState;
  projectType: ProjectType;
  repoData?: AccessFormState;
};
