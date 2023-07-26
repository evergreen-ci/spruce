import { ProjectType } from "../utils";

export enum IntervalSpecifier {
  Hours = "HOURS",
  Cron = "CRON",
}

type FormPeriodicBuild = {
  id: string;
  interval: {
    specifier: IntervalSpecifier;
    intervalHours: number;
    cron: string;
  };
  configFile: string;
  displayTitle?: string;
  alias: string;
  message: string;
  nextRunTime: string;
};

export interface PeriodicBuildsFormState {
  periodicBuildsOverride: boolean;
  periodicBuilds: FormPeriodicBuild[];
  repoData?: {
    periodicBuildsOverride: boolean;
    periodicBuilds: FormPeriodicBuild[];
  };
}

export type TabProps = {
  projectData?: PeriodicBuildsFormState;
  projectType: ProjectType;
  repoData?: PeriodicBuildsFormState;
};
