import { ProjectType } from "../utils";

type FormPeriodicBuild = {
  id: string;
  intervalHours: number;
  configFile: string;
  displayTitle?: string;
  alias: string;
  message: string;
  nextRunTime: string;
};

export interface FormState {
  periodicBuildsOverride: boolean;
  periodicBuilds: FormPeriodicBuild[];
  repoData?: {
    periodicBuildsOverride: boolean;
    periodicBuilds: FormPeriodicBuild[];
  };
}

export type TabProps = {
  projectData?: FormState;
  projectType: ProjectType;
  repoData?: FormState;
};
