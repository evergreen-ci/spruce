import { ProjectType } from "../utils";

export interface ContainersFormState {
  containerSizeDefinitions: {
    variables: {
      cpu: number;
      memoryMb: number;
      name: string;
    }[];
  };
}

export type TabProps = {
  identifier: string;
  projectData?: ContainersFormState;
  projectType: ProjectType;
  repoData?: ContainersFormState;
};
