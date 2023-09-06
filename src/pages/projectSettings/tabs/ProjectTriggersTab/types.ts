import { ProjectType } from "../utils";

type FormTrigger = {
  project: string;
  dateCutoff: number | null;
  level: string;
  status: string;
  buildVariantRegex: string;
  taskRegex: string;
  configFile: string;
  alias: string;
  displayTitle?: string;
  unscheduleDownstreamVersions: boolean;
};

export type ProjectTriggersFormState = {
  triggersOverride: boolean;
  triggers: FormTrigger[];
  repoData?: {
    triggersOverride: boolean;
    triggers: FormTrigger[];
  };
};

export type TabProps = {
  projectData?: ProjectTriggersFormState;
  projectType: ProjectType;
  repoData?: ProjectTriggersFormState;
};
