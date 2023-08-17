import { useMemo } from "react";
import Banner from "@leafygreen-ui/banner";
import { ProjectSettingsTabRoutes } from "constants/routes";
import { useSpruceConfig } from "hooks";
import { BaseTab } from "../BaseTab";
import { getFormSchema } from "./getFormSchema";
import { TabProps } from "./types";

const tab = ProjectSettingsTabRoutes.Containers;

export const ContainersTab: React.FC<TabProps> = ({
  projectData,
  repoData,
}) => {
  const initialFormState = projectData || repoData;

  const { providers } = useSpruceConfig() || {};
  const { aws } = providers || {};
  const { pod } = aws || {};
  const { ecs } = pod || {};

  const formSchema = useMemo(() => getFormSchema(ecs), [ecs]);

  if (!ecs) return null;

  return (
    <>
      <Banner variant="warning">
        Running tasks on containers is currently in beta, and is only available
        to a select group of initial candidates. If you have any questions about
        container tasks or are interested in exploring how this feature could
        benefit your project, please reach out to us in #evergreen-users
      </Banner>
      <BaseTab
        formSchema={formSchema}
        initialFormState={initialFormState}
        tab={tab}
      />
    </>
  );
};
