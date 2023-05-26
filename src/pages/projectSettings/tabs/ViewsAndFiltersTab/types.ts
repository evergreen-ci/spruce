import { ProjectType } from "../utils";

export interface FormState {}

export type TabProps = {
  identifier: string;
  projectData?: FormState;
  projectType: ProjectType;
};
