import styled from "@emotion/styled";
import { useBreadcrumbAnalytics } from "analytics";
import Breadcrumbs, { Breadcrumb } from "components/Breadcrumbs";
import { getVersionRoute } from "constants/routes";
import { size } from "constants/tokens";
import { useBreadcrumbRoot } from "hooks";
import { shortenGithash } from "utils/string";

interface TaskPageBreadcrumbsProps {
  taskName: string;
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
const TaskPageBreadcrumbs: React.VFC<TaskPageBreadcrumbsProps> = ({
  versionMetadata,
  patchNumber,
}) => {
  const { isPatch, author, projectIdentifier, id, message, revision } =
    versionMetadata ?? {};
  const breadcrumbRoot = useBreadcrumbRoot(isPatch, author, projectIdentifier);
  const breadcrumbAnalytics = useBreadcrumbAnalytics();

  const messageBreadcrumb = {
    to: getVersionRoute(id),
    text: message,
    onClick: () => {
      breadcrumbAnalytics.sendEvent({
        name: "Click Link",
        link: "version",
      });
    },
    "data-cy": "bc-message",
  };
  const patchBreadcrumb = {
    text: `Patch ${patchNumber}`,
    "data-cy": "bc-patch",
  };

  const commitBreadcrumb = {
    text: shortenGithash(revision),
    "data-cy": "bc-version",
  };

  const breadcrumbs: Breadcrumb[] = [
    breadcrumbRoot,
    messageBreadcrumb,
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

export default TaskPageBreadcrumbs;
