import { ProjectHealthView } from "gql/generated/types";
import { ProjectType } from "../utils";

type ParsleyFilter = {
  caseSensitive: boolean;
  displayTitle?: string;
  exactMatch: boolean;
  expression: string;
};

export interface ViewsFormState {
  view?: {
    projectHealthView: ProjectHealthView;
  };
  parsleyFilters: ParsleyFilter[];
  repoData?: {
    parsleyFilters: ParsleyFilter[];
  };
}

export type TabProps = {
  identifier: string;
  projectData?: ViewsFormState;
  projectType: ProjectType;
  repoData?: ViewsFormState;
};
