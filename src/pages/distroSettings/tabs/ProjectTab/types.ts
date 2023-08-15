import { CloneMethod } from "gql/generated/types";

export interface ProjectFormState {
  cloneMethod: CloneMethod;
  expansions: Array<{
    key: string;
    value: string;
  }>;
  validProjects: string[];
}

export type TabProps = {
  distroData: ProjectFormState;
};
