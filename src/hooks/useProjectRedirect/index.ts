import { useQuery } from "@apollo/client";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { ProjectQuery, ProjectQueryVariables } from "gql/generated/types";
import { PROJECT } from "gql/queries";
import { validators } from "utils";

const { validateObjectId } = validators;

interface UseProjectRedirectProps {
  sendAnalyticsEvent: (projectId: string, projectIdentifier: string) => void;
}

/**
 * useProjectRedirect will replace the project id with the project identifier in the URL.
 * @param props - Object containing the following:
 * @param props.sendAnalyticsEvent - analytics event to send upon redirect
 * @returns isRedirecting - boolean to indicate if a redirect is in progress
 */
export const useProjectRedirect = ({
  sendAnalyticsEvent = () => {},
}: UseProjectRedirectProps) => {
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
      sendAnalyticsEvent(project, identifier);
      navigate(redirectPathname);
    },
  });

  return { isRedirecting: needsRedirect && loading };
};
