import { useQuery } from "@apollo/client";
import {
  ProjectBannerQuery,
  ProjectBannerQueryVariables,
} from "gql/generated/types";
import { PROJECT_BANNER } from "gql/queries";
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
  >(PROJECT_BANNER, {
    variables: { identifier: projectIdentifier },
    skip: !projectIdentifier,
  });
  const { text, theme } = projectBannerData?.project.banner || {};
  if (!text) {
    return null;
  }
  return <PortalBanner theme={theme} text={text} />;
};
