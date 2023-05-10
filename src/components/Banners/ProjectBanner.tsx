import { useQuery } from "@apollo/client";
import {
  ProjectBannerQuery,
  ProjectBannerQueryVariables,
} from "gql/generated/types";
import { GET_PROJECT_BANNER } from "gql/queries";
import { PortalBanner } from "./PortalBanner";

interface ProjectBannerProps {
  projectIdentifier: string;
}
export const ProjectBanner: React.FC<ProjectBannerProps> = ({
  projectIdentifier,
}) => {
  const { data: projectBannerData } = useQuery<
    ProjectBannerQuery,
    ProjectBannerQueryVariables
  >(GET_PROJECT_BANNER, {
    variables: { identifier: projectIdentifier },
    skip: !projectIdentifier,
  });
  const { theme, text } = projectBannerData?.project.banner || {};
  return <PortalBanner theme={theme} text={text} />;
};
