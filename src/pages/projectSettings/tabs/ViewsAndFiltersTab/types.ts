import { ProjectHealthView } from "gql/generated/types";
import { ProjectType } from "../utils";

export interface ViewsFormState {
  view?: {
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
  projectData?: ViewsFormState;
  projectType: ProjectType;
  repoData?: ViewsFormState;
};
