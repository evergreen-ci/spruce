import { ProjectType } from "../utils";

export enum CaseSensitivity {
  Sensitive = "sensitive",
  Insensitive = "insensitive",
}

export enum MatchType {
  Exact = "exact",
  Inverse = "inverse",
}

export interface FormState {
  parsleyFilters: {
    displayTitle?: string;
    expression: string;
    caseSensitivity: CaseSensitivity;
    matchType: MatchType;
  }[];
}

export type TabProps = {
  identifier: string;
  projectData?: FormState;
  projectType: ProjectType;
};
