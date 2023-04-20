import { ProjectType } from "../utils";

export interface FormState {
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
  projectData?: FormState;
  projectType: ProjectType;
  repoData?: FormState;
};
