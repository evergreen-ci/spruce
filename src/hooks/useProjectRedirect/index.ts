import { useQuery } from "@apollo/client";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { ProjectQuery, ProjectQueryVariables } from "gql/generated/types";
import { PROJECT } from "gql/queries";
import { validators } from "utils";

const { validateObjectId } = validators;

/**
 * useProjectRedirect will replace the project id with the project identifier in the URL.
 * @returns isRedirecting - boolean to indicate if a redirect is in progress
 */
export const useProjectRedirect = () => {
  const { projectIdentifier: project } = useParams<{
    projectIdentifier: string;
  }>();
  const navigate = useNavigate();
  const location = useLocation();

  const needsRedirect = validateObjectId(project);

  const { loading } = useQuery<ProjectQuery, ProjectQueryVariables>(PROJECT, {
    skip: !needsRedirect,
    variables: {
      idOrIdentifier: project,
    },
    onCompleted: (projectData) => {
      const { identifier } = projectData.project;
      const currentUrl = location.pathname.concat(location.search);
      const redirectPathname = currentUrl.replace(project, identifier);
      navigate(redirectPathname);
    },
  });

  return { isRedirecting: needsRedirect && loading };
};
