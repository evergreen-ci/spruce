import { ProjectType } from "../utils";

type FormTrigger = {
  project: string;
  dateCutoff: number;
  level: string;
  status: string;
  buildVariantRegex: string;
  taskRegex: string;
  configFile: string;
  alias: string;
  displayTitle?: string;
};

export type FormState = {
  triggersOverride: boolean;
  triggers: FormTrigger[];
  repoData?: {
    triggersOverride: boolean;
    triggers: FormTrigger[];
  };
};

export type TabProps = {
  projectData?: FormState;
  projectType: ProjectType;
  repoData?: FormState;
};
