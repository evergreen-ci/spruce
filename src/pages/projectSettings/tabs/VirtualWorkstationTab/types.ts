import { ProjectType } from "../utils";

export interface FormState {
  gitClone: boolean | null;
  commands: {
    setupCommandsOverride: boolean;
    setupCommands: Array<{
      command: string;
      directory: string;
    }>;
  };
}

export type TabProps = {
  identifier: string;
  projectData?: FormState;
  projectType: ProjectType;
  repoData?: FormState;
};
