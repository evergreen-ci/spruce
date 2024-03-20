import AGENT_LOGS from "./agent-logs.graphql";
import ALL_LOGS from "./all-logs.graphql";
import ANNOTATION_EVENT_DATA from "./annotation-event-data.graphql";
import AWS_REGIONS from "./aws-regions.graphql";
import BASE_VERSION_AND_TASK from "./base-version-and-task.graphql";
import BUILD_BARON_CONFIGURED from "./build-baron-configured.graphql";
import BUILD_BARON from "./build-baron.graphql";
import BUILD_VARIANTS_STATS from "./build-variant-stats.graphql";
import BUILD_VARIANTS_FOR_TASK_NAME from "./build-variants-for-task-name.graphql";
import BUILD_VARIANTS_WITH_CHILDREN from "./build-variants-with-children.graphql";
import CLIENT_CONFIG from "./client-config.graphql";
import CODE_CHANGES from "./code-changes.graphql";
import COMMIT_QUEUE from "./commit-queue.graphql";
import CREATED_TICKETS from "./created-tickets.graphql";
import DISPLAY_TASK from "./display-task.graphql";
import DISTRO_EVENTS from "./distro-events.graphql";
import DISTRO_TASK_QUEUE from "./distro-task-queue.graphql";
import DISTRO from "./distro.graphql";
import DISTROS from "./distros.graphql";
import FAILED_TASK_STATUS_ICON_TOOLTIP from "./failed-task-status-icon-tooltip.graphql";
import GITHUB_ORGS from "./github-orgs.graphql";
import GITHUB_PROJECT_CONFLICTS from "./github-project-conflicts.graphql";
import HAS_VERSION from "./has-version.graphql";
import HOST_EVENTS from "./host-events.graphql";
import HOST from "./host.graphql";
import HOSTS from "./hosts.graphql";
import INSTANCE_TYPES from "./instance-types.graphql";
import IS_PATCH_CONFIGURED from "./is-patch-configured.graphql";
import JIRA_CUSTOM_CREATED_ISSUES from "./jira-custom-created-issues.graphql";
import JIRA_ISSUES from "./jira-issues.graphql";
import JIRA_SUSPECTED_ISSUES from "./jira-suspected-issues.graphql";
import LAST_MAINLINE_COMMIT from "./last-mainline-commit.graphql";
import LOGKEEPER_BUILD_METADATA from "./logkeeper-build-metadata.graphql";
import MAINLINE_COMMITS_FOR_HISTORY from "./mainline-commits-for-history.graphql";
import MAINLINE_COMMITS from "./mainline-commits.graphql";
import MY_HOSTS from "./my-hosts.graphql";
import MY_VOLUMES from "./my-volumes.graphql";
import OTHER_USER from "./other-user.graphql";
import PATCH_CONFIGURE from "./patch-configure.graphql";
import PATCH_TASK_STATUSES from "./patch-task-statuses.graphql";
import PATCH from "./patch.graphql";
import POD_EVENTS from "./pod-events.graphql";
import POD from "./pod.graphql";
import PROJECT_BANNER from "./project-banner.graphql";
import PROJECT_EVENT_LOGS from "./project-event-logs.graphql";
import PROJECT_HEALTH_VIEW from "./project-health-view.graphql";
import PROJECT_PATCHES from "./project-patches.graphql";
import PROJECT_SETTINGS from "./project-settings.graphql";
import PROJECT from "./project.graphql";
import PROJECTS from "./projects.graphql";
import MY_PUBLIC_KEYS from "./public-keys.graphql";
import REPO_EVENT_LOGS from "./repo-event-logs.graphql";
import REPO_SETTINGS from "./repo-settings.graphql";
import REPOTRACKER_ERROR from "./repotracker-error.graphql";
import SPAWN_EXPIRATION_INFO from "./spawn-expiration.graphql";
import SPAWN_TASK from "./spawn-task.graphql";
import SPRUCE_CONFIG from "./spruce-config.graphql";
import SUBNET_AVAILABILITY_ZONES from "./subnet-availability-zones.graphql";
import SYSTEM_LOGS from "./system-logs.graphql";
import TASK_ALL_EXECUTIONS from "./task-all-executions.graphql";
import TASK_EVENT_LOGS from "./task-event-logs.graphql";
import TASK_FILES from "./task-files.graphql";
import TASK_LOGS from "./task-logs.graphql";
import TASK_NAMES_FOR_BUILD_VARIANT from "./task-names-for-build-variant.graphql";
import TASK_QUEUE_DISTROS from "./task-queue-distros.graphql";
import TASK_STATUSES from "./task-statuses.graphql";
import TASK_TEST_SAMPLE from "./task-test-sample.graphql";
import TASK_TESTS from "./task-tests.graphql";
import TASK from "./task.graphql";
import UNSCHEDULED_TASKS from "./undispatched-tasks.graphql";
import USER_CONFIG from "./user-config.graphql";
import USER_DISTRO_SETTINGS_PERMISSIONS from "./user-distro-settings-permissions.graphql";
import USER_PATCHES from "./user-patches.graphql";
import USER_PROJECT_SETTINGS_PERMISSIONS from "./user-project-settings-permissions.graphql";
import USER_SETTINGS from "./user-settings.graphql";
import USER_SUBSCRIPTIONS from "./user-subscriptions.graphql";
import USER from "./user.graphql";
import VERSION_TASK_DURATIONS from "./version-task-durations.graphql";
import VERSION_TASKS from "./version-tasks.graphql";
import VERSION from "./version.graphql";
import VIEWABLE_PROJECTS from "./viewable-projects.graphql";

export {
  AGENT_LOGS,
  ALL_LOGS,
  ANNOTATION_EVENT_DATA,
  AWS_REGIONS,
  BASE_VERSION_AND_TASK,
  BUILD_BARON_CONFIGURED,
  BUILD_BARON,
  BUILD_VARIANTS_FOR_TASK_NAME,
  BUILD_VARIANTS_STATS,
  BUILD_VARIANTS_WITH_CHILDREN,
  CLIENT_CONFIG,
  CODE_CHANGES,
  COMMIT_QUEUE,
  CREATED_TICKETS,
  DISPLAY_TASK,
  DISTRO_EVENTS,
  DISTRO_TASK_QUEUE,
  DISTRO,
  DISTROS,
  FAILED_TASK_STATUS_ICON_TOOLTIP,
  GITHUB_ORGS,
  GITHUB_PROJECT_CONFLICTS,
  HAS_VERSION,
  HOST_EVENTS,
  HOST,
  HOSTS,
  INSTANCE_TYPES,
  IS_PATCH_CONFIGURED,
  JIRA_CUSTOM_CREATED_ISSUES,
  JIRA_ISSUES,
  JIRA_SUSPECTED_ISSUES,
  LAST_MAINLINE_COMMIT,
  LOGKEEPER_BUILD_METADATA,
  MAINLINE_COMMITS_FOR_HISTORY,
  MAINLINE_COMMITS,
  MY_HOSTS,
  MY_PUBLIC_KEYS,
  MY_VOLUMES,
  OTHER_USER,
  PATCH_CONFIGURE,
  PATCH_TASK_STATUSES,
  PATCH,
  POD_EVENTS,
  POD,
  PROJECT,
  PROJECT_BANNER,
  PROJECT_EVENT_LOGS,
  PROJECT_HEALTH_VIEW,
  PROJECT_PATCHES,
  PROJECT_SETTINGS,
  PROJECTS,
  REPO_EVENT_LOGS,
  REPO_SETTINGS,
  REPOTRACKER_ERROR,
  SPAWN_EXPIRATION_INFO,
  SPAWN_TASK,
  SPRUCE_CONFIG,
  SUBNET_AVAILABILITY_ZONES,
  SYSTEM_LOGS,
  TASK_ALL_EXECUTIONS,
  TASK_EVENT_LOGS,
  TASK_FILES,
  TASK_LOGS,
  TASK_NAMES_FOR_BUILD_VARIANT,
  TASK_QUEUE_DISTROS,
  TASK_STATUSES,
  TASK_TEST_SAMPLE,
  TASK_TESTS,
  TASK,
  UNSCHEDULED_TASKS,
  USER_CONFIG,
  USER_PATCHES,
  USER_DISTRO_SETTINGS_PERMISSIONS,
  USER_PROJECT_SETTINGS_PERMISSIONS,
  USER_SETTINGS,
  USER_SUBSCRIPTIONS,
  USER,
  VERSION_TASK_DURATIONS,
  VERSION_TASKS,
  VERSION,
  VIEWABLE_PROJECTS,
};
