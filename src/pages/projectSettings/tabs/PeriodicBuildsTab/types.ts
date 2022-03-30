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
    nextRunTime: string;
  }>;
}

export type TabProps = {
  projectData?: FormState;
  projectType: ProjectType;
  repoData?: FormState;
};
