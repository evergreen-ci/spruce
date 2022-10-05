import styled from "@emotion/styled";
import { useBreadcrumbAnalytics } from "analytics";
import Breadcrumbs, { Breadcrumb } from "components/Breadcrumbs";
import { size } from "constants/tokens";
import { useBreadcrumbRoot } from "hooks";
import { shortenGithash } from "utils/string";

interface VersionPageBreadcrumbsProps {
  patchNumber?: number;
  versionMetadata?: {
    id: string;
    revision: string;
    project: string;
    isPatch: boolean;
    author: string;
    projectIdentifier: string;
    message: string;
  };
}

const VersionPageBreadcrumbs: React.VFC<VersionPageBreadcrumbsProps> = ({
  versionMetadata,
  patchNumber,
}) => {
  const { isPatch, author, projectIdentifier, revision } =
    versionMetadata ?? {};
  const breadcrumbRoot = useBreadcrumbRoot(isPatch, author, projectIdentifier);
  const breadcrumbAnalytics = useBreadcrumbAnalytics();

  const patchBreadcrumb = {
    text: `Patch ${patchNumber}`,
    onClick: () => {
      breadcrumbAnalytics.sendEvent({
        name: "Click Link",
        link: "version",
      });
    },
    "data-cy": "bc-patch",
  };

  const commitBreadcrumb = {
    text: shortenGithash(revision),
    onClick: () => {
      breadcrumbAnalytics.sendEvent({
        name: "Click Link",
        link: "version",
      });
    },
    "data-cy": "bc-version",
  };

  const breadcrumbs: Breadcrumb[] = [
    breadcrumbRoot,
    isPatch ? patchBreadcrumb : commitBreadcrumb,
  ];

  return (
    <Container>
      <Breadcrumbs breadcrumbs={breadcrumbs} />
    </Container>
  );
};

const Container = styled.div`
  margin-bottom: ${size.s};
`;

export default VersionPageBreadcrumbs;
