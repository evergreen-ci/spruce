import { ProjectType } from "../utils";

export interface FormState {
  parsleyFilters: {
    displayTitle?: string;
    expression: string;
    caseSensitive: boolean;
    exactMatch: boolean;
  }[];
}

export type TabProps = {
  identifier: string;
  projectData?: FormState;
  projectType: ProjectType;
};
