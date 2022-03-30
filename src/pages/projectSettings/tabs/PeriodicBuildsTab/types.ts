import { ProjectType } from "../utils";

export interface FormState {
  periodicBuildsOverride: boolean;
  periodicBuilds: Array<{
    id: string;
    intervalHours: number;
    configFile: string;
    displayTitle?: string;
    alias: string;
    message: string;
    nextRunTime: Date;
  }>;
}

export type TabProps = {
  projectData?: FormState;
  projectType: ProjectType;
  repoData?: FormState;
};
