import GET_AWS_REGIONS from "./aws-regions.graphql";
import DISTRO_TASK_QUEUE from "./distro-task-queue.graphql";
import GET_FAILED_TASK_STATUS_ICON_TOOLTIP from "./failed-task-status-icon-tooltip.graphql";
import GET_AGENT_LOGS from "./get-agent-logs.graphql";
import GET_ALL_LOGS from "./get-all-logs.graphql";
import GET_ANNOTATION_EVENT_DATA from "./get-annotation-event-data.graphql";
import GET_BASE_VERSION_AND_TASK from "./get-base-version-and-task.graphql";
import GET_BUILD_BARON_CONFIGURED from "./get-build-baron-configured.graphql";
import GET_BUILD_BARON from "./get-build-baron.graphql";
import GET_BUILD_VARIANTS_STATS from "./get-build-variant-stats.graphql";
import GET_BUILD_VARIANTS_FOR_TASK_NAME from "./get-build-variants-for-task-name.graphql";
import GET_BUILD_VARIANTS_WITH_CHILDREN from "./get-build-variants-with-children.graphql";
import GET_CLIENT_CONFIG from "./get-client-config.graphql";
import GET_CODE_CHANGES from "./get-code-changes.graphql";
import GET_COMMIT_QUEUE from "./get-commit-queue.graphql";
import GET_CREATED_TICKETS from "./get-created-tickets.graphql";
import GET_DISPLAY_TASK from "./get-display-task.graphql";
import GET_DISTROS from "./get-distros.graphql";
import GET_GITHUB_ORGS from "./get-github-orgs.graphql";
import GET_GITHUB_PROJECT_CONFLICTS from "./get-github-project-conflicts.graphql";
import GET_HAS_VERSION from "./get-has-version.graphql";
import GET_HOST_EVENTS from "./get-host-events.graphql";
import GET_HOST from "./get-host.graphql";
import GET_INSTANCE_TYPES from "./get-instance-types.graphql";
import GET_IS_PATCH_CONFIGURED from "./get-is-patch-configured.graphql";
import GET_JIRA_CUSTOM_CREATED_ISSUES from "./get-jira-custom-created-issues.graphql";
import GET_JIRA_ISSUES from "./get-jira-issues.graphql";
import GET_JIRA_SUSPECTED_ISSUES from "./get-jira-suspected-issues.graphql";
import GET_LAST_MAINLINE_COMMIT from "./get-last-mainline-commit.graphql";
import GET_LOGKEEPER_BUILD_METADATA from "./get-logkeeper-build-metadata.graphql";
import GET_MAINLINE_COMMITS_FOR_HISTORY from "./get-mainline-commits-for-history.graphql";
import GET_MAINLINE_COMMITS from "./get-mainline-commits.graphql";
import GET_MY_HOSTS from "./get-my-hosts.graphql";
import GET_MY_VOLUMES from "./get-my-volumes.graphql";
import GET_OTHER_USER from "./get-other-user.graphql";
import GET_PATCH_CONFIGURE from "./get-patch-configure.graphql";
import GET_PATCH_TASK_STATUSES from "./get-patch-task-statuses.graphql";
import GET_PATCH from "./get-patch.graphql";
import GET_POD_EVENTS from "./get-pod-events.graphql";
import GET_POD from "./get-pod.graphql";
import GET_PROJECT_BANNER from "./get-project-banner.graphql";
import GET_PROJECT_EVENT_LOGS from "./get-project-event-logs.graphql";
import GET_PROJECT_SETTINGS from "./get-project-settings.graphql";
import GET_PROJECTS from "./get-projects.graphql";
import GET_MY_PUBLIC_KEYS from "./get-public-keys.graphql";
import GET_REPO_EVENT_LOGS from "./get-repo-event-logs.graphql";
import GET_REPO_SETTINGS from "./get-repo-settings.graphql";
import GET_SPRUCE_CONFIG from "./get-spruce-config.graphql";
import GET_SYSTEM_LOGS from "./get-system-logs.graphql";
import GET_TASK_ALL_EXECUTIONS from "./get-task-all-executions.graphql";
import GET_TASK_EVENT_LOGS from "./get-task-event-logs.graphql";
import GET_TASK_FILES from "./get-task-files.graphql";
import GET_TASK_LOGS from "./get-task-logs.graphql";
import GET_TASK_NAMES_FOR_BUILD_VARIANT from "./get-task-names-for-build-variant.graphql";
import GET_TASK_STATUSES from "./get-task-statuses.graphql";
import GET_TASK_TEST_SAMPLE from "./get-task-test-sample.graphql";
import GET_TASK_TESTS from "./get-task-tests.graphql";
import GET_TASK from "./get-task.graphql";
import GET_UNSCHEDULED_TASKS from "./get-undispatched-tasks.graphql";
import GET_USER_CONFIG from "./get-user-config.graphql";
import GET_USER_PERMISSIONS from "./get-user-permissions.graphql";
import GET_USER_SETTINGS from "./get-user-settings.graphql";
import GET_USER from "./get-user.graphql";
import GET_VERSION_TASK_DURATIONS from "./get-version-task-durations.graphql";
import GET_VERSION_TASKS from "./get-version-tasks.graphql";
import GET_VERSION from "./get-version.graphql";
import GET_VIEWABLE_PROJECTS from "./get-viewable-projects.graphql";
import HOSTS from "./hosts.graphql";
import PROJECT_HEALTH_VIEW from "./project-health-view.graphql";
import GET_PROJECT_PATCHES from "./project-patches.graphql";
import GET_SPAWN_EXPIRATION_INFO from "./spawn-expiration.graphql";
import GET_SPAWN_TASK from "./spawn-task.graphql";
import GET_SUBNET_AVAILABILITY_ZONES from "./subnet-availability-zones.graphql";
import TASK_QUEUE_DISTROS from "./task-queue-distros.graphql";
import GET_USER_PATCHES from "./user-patches.graphql";
import USER_SUBSCRIPTIONS from "./user-subscriptions.graphql";

export {
  DISTRO_TASK_QUEUE,
  GET_AGENT_LOGS,
  GET_ALL_LOGS,
  GET_ANNOTATION_EVENT_DATA,
  GET_AWS_REGIONS,
  GET_BASE_VERSION_AND_TASK,
  GET_BUILD_BARON_CONFIGURED,
  GET_BUILD_BARON,
  GET_BUILD_VARIANTS_FOR_TASK_NAME,
  GET_BUILD_VARIANTS_STATS,
  GET_BUILD_VARIANTS_WITH_CHILDREN,
  GET_CLIENT_CONFIG,
  GET_CODE_CHANGES,
  GET_COMMIT_QUEUE,
  GET_CREATED_TICKETS,
  GET_DISPLAY_TASK,
  GET_DISTROS,
  GET_FAILED_TASK_STATUS_ICON_TOOLTIP,
  GET_GITHUB_ORGS,
  GET_GITHUB_PROJECT_CONFLICTS,
  GET_HAS_VERSION,
  GET_HOST_EVENTS,
  GET_HOST,
  GET_INSTANCE_TYPES,
  GET_IS_PATCH_CONFIGURED,
  GET_JIRA_CUSTOM_CREATED_ISSUES,
  GET_JIRA_ISSUES,
  GET_JIRA_SUSPECTED_ISSUES,
  GET_LAST_MAINLINE_COMMIT,
  GET_LOGKEEPER_BUILD_METADATA,
  GET_MAINLINE_COMMITS_FOR_HISTORY,
  GET_MAINLINE_COMMITS,
  GET_MY_HOSTS,
  GET_MY_PUBLIC_KEYS,
  GET_MY_VOLUMES,
  GET_OTHER_USER,
  GET_PATCH_CONFIGURE,
  GET_PATCH_TASK_STATUSES,
  GET_PATCH,
  GET_POD_EVENTS,
  GET_POD,
  GET_PROJECT_BANNER,
  GET_PROJECT_EVENT_LOGS,
  GET_PROJECT_PATCHES,
  GET_PROJECT_SETTINGS,
  GET_PROJECTS,
  GET_REPO_EVENT_LOGS,
  GET_REPO_SETTINGS,
  GET_SPAWN_EXPIRATION_INFO,
  GET_SPAWN_TASK,
  GET_SPRUCE_CONFIG,
  GET_SUBNET_AVAILABILITY_ZONES,
  GET_SYSTEM_LOGS,
  GET_TASK_ALL_EXECUTIONS,
  GET_TASK_EVENT_LOGS,
  GET_TASK_FILES,
  GET_TASK_LOGS,
  GET_TASK_NAMES_FOR_BUILD_VARIANT,
  GET_TASK_STATUSES,
  GET_TASK_TEST_SAMPLE,
  GET_TASK_TESTS,
  GET_TASK,
  GET_UNSCHEDULED_TASKS,
  GET_USER_CONFIG,
  GET_USER_PATCHES,
  GET_USER_PERMISSIONS,
  GET_USER_SETTINGS,
  GET_USER,
  GET_VERSION_TASK_DURATIONS,
  GET_VERSION_TASKS,
  GET_VERSION,
  GET_VIEWABLE_PROJECTS,
  HOSTS,
  PROJECT_HEALTH_VIEW,
  TASK_QUEUE_DISTROS,
  USER_SUBSCRIPTIONS,
};
