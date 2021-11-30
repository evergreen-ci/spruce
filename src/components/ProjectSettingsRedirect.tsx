import { useQuery } from "@apollo/client";
import { Redirect } from "react-router-dom";
import {
  getProjectSettingsRoute,
  ProjectSettingsTabRoutes,
} from "constants/routes";
import {
  GetViewableProjectRefsQuery,
  GetViewableProjectRefsQueryVariables,
} from "gql/generated/types";
import { GET_VIEWABLE_PROJECTS } from "gql/queries";

export const ProjectSettingsRedirect: React.FC = () => {
  const { data } = useQuery<
    GetViewableProjectRefsQuery,
    GetViewableProjectRefsQueryVariables
  >(GET_VIEWABLE_PROJECTS);

  if (data) {
    const { viewableProjectRefs } = data;
    if (
      viewableProjectRefs.length !== 0 &&
      viewableProjectRefs[0]?.projects.length !== 0
    ) {
      return (
        <Redirect
          to={getProjectSettingsRoute(
            viewableProjectRefs[0].projects[0].identifier,
            ProjectSettingsTabRoutes.General
          )}
        />
      );
    }
  }
  return null;
};
