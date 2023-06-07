import { ProjectHealthView } from "gql/generated/types";
import { ProjectType } from "../utils";

export interface FormState {
  view: {
    projectHealthView: ProjectHealthView;
  };
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
