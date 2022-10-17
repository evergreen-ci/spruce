import { useBreadcrumbAnalytics } from "analytics";
import Breadcrumbs, { Breadcrumb } from "components/Breadcrumbs";
import { getVersionRoute } from "constants/routes";
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
  taskName,
}) => {
  const { isPatch, author, projectIdentifier, id, message, revision } =
    versionMetadata ?? {};
  const breadcrumbRoot = useBreadcrumbRoot(isPatch, author, projectIdentifier);
  const breadcrumbAnalytics = useBreadcrumbAnalytics();

  const messagePrefix = isPatch
    ? `Patch ${patchNumber}`
    : shortenGithash(revision);

  const messageBreadcrumb = {
    to: getVersionRoute(id),
    text: `${messagePrefix} - ${message}`,
    onClick: () => {
      breadcrumbAnalytics.sendEvent({
        name: "Click Link",
        link: "version",
      });
    },
    "data-cy": "bc-message",
  };

  const taskBreadcrumb = {
    text: taskName,
    "data-cy": "bc-task",
  };

  const breadcrumbs: Breadcrumb[] = [
    breadcrumbRoot,
    messageBreadcrumb,
    taskBreadcrumb,
  ];

  return <Breadcrumbs breadcrumbs={breadcrumbs} />;
};

export default TaskPageBreadcrumbs;
