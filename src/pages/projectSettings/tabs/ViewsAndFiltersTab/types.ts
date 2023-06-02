import { ProjectType } from "../utils";

export interface FormState {
  parsleyFilters: {
    caseSensitive: boolean;
    displayTitle?: string;
    exactMatch: boolean;
    expression: string;
  }[];
}

export type TabProps = {
  identifier: string;
  projectData?: FormState;
  projectType: ProjectType;
};
