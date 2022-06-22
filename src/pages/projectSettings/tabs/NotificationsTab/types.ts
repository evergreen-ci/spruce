import { FormDataProps } from "components/SpruceForm";
import { ProjectType } from "../utils/types";

export interface FormState extends FormDataProps {
  buildBreakSettings: {
    notifyOnBuildFailure: boolean | null;
  };
  subscriptions: Array<{
    id: string;
    resourceType: string;
    trigger: string;
    ownerType: string;
  }> | null;
}

export type TabProps = {
  projectData?: FormState;
  projectType: ProjectType;
  repoData?: FormState;
  id?: string;
};
