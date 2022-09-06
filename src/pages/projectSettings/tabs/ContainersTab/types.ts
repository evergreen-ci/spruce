import { ProjectType } from "../utils";

type ContainerSize = {
  name: string;
  cpu: number;
  memoryMb: number;
};

export interface FormState {
  containerSizeDefinitionsOverride: boolean;
  containerSizeDefinitions: ContainerSize[];
  repoData?: {
    containerSizeDefinitionsOverride: boolean;
    containerSizeDefinitions: ContainerSize[];
  };
}

export type TabProps = {
  projectData?: FormState;
  projectType: ProjectType;
  repoData?: FormState;
};
