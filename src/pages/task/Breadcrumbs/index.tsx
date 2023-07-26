import { useBreadcrumbAnalytics } from "analytics";
import Breadcrumbs, { Breadcrumb } from "components/Breadcrumbs";
import { getTaskRoute, getVersionRoute } from "constants/routes";
import { useBreadcrumbRoot } from "hooks";
import { shortenGithash } from "utils/string";

interface TaskPageBreadcrumbsProps {
  displayTask?: {
    displayName: string;
    execution: number;
    id: string;
  };
  patchNumber?: number;
  taskName: string;
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
  displayTask,
  patchNumber,
  taskName,
  versionMetadata,
}) => {
  const { author, id, isPatch, message, projectIdentifier, revision } =
    versionMetadata ?? {};
  const breadcrumbRoot = useBreadcrumbRoot(isPatch, author, projectIdentifier);
  const breadcrumbAnalytics = useBreadcrumbAnalytics();

  const messagePrefix = isPatch
    ? `Patch ${patchNumber}`
    : shortenGithash(revision);

  const messageBreadcrumb = {
    "data-cy": "bc-message",
    onClick: () => {
      breadcrumbAnalytics.sendEvent({
        link: "version",
        name: "Click Link",
      });
    },
    text: `${messagePrefix} - ${message}`,
    to: getVersionRoute(id),
  };

  const displayTaskBreadcrumb = displayTask
    ? [
        {
          "data-cy": "bc-display-task",
          onClick: () => {
            breadcrumbAnalytics.sendEvent({
              link: "displayTask",
              name: "Click Link",
            });
          },
          text: displayTask.displayName,
          to: getTaskRoute(displayTask.id, {
            execution: displayTask.execution,
          }),
        },
      ]
    : [];

  const taskBreadcrumb = {
    "data-cy": "bc-task",
    text: taskName,
  };

  const breadcrumbs: Breadcrumb[] = [
    breadcrumbRoot,
    messageBreadcrumb,
    ...displayTaskBreadcrumb,
    taskBreadcrumb,
  ];

  return <Breadcrumbs breadcrumbs={breadcrumbs} />;
};

export default TaskPageBreadcrumbs;
