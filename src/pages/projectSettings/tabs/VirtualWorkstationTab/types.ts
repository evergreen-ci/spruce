import { ProjectType } from "../utils";

export interface VWFormState {
  gitClone: boolean | null;
  commands: {
    setupCommandsOverride: boolean;
    setupCommands: Array<{
      command: string;
      directory: string;
    }>;
    repoData?: {
      setupCommandsOverride: boolean;
      setupCommands: Array<{
        command: string;
        directory: string;
      }>;
    };
  };
}

export type TabProps = {
  identifier: string;
  projectData?: VWFormState;
  projectType: ProjectType;
  repoData?: VWFormState;
};
