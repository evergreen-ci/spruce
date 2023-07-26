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
    skip: !projectIdentifier,
    variables: { identifier: projectIdentifier },
  });
  const { text, theme } = projectBannerData?.project.banner || {};
  return <PortalBanner theme={theme} text={text} />;
};
