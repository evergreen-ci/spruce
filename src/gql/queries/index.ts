import GET_AWS_REGIONS from "./aws-regions.graphql";

import DISTRO_TASK_QUEUE from "./distro-task-queue.graphql";
import GET_BUILD_BARON from "./get-build-baron.graphql";
import GET_CLIENT_CONFIG from "./get-client-config.graphql";
import GET_CODE_CHANGES from "./get-code-changes.graphql";
import GET_COMMIT_QUEUE from "./get-commit-queue.graphql";
import GET_CREATED_TICKETS from "./get-created-tickets.graphql";
import GET_DISTROS from "./get-distros.graphql";
import GET_HOST_EVENTS from "./get-host-events.graphql";
import GET_HOST from "./get-host.graphql";
import GET_INSTANCE_TYPES from "./get-instance-types.graphql";
import GET_MY_HOSTS from "./get-my-hosts.graphql";
import GET_MY_VOLUMES from "./get-my-volumes.graphql";
import GET_PATCH_BUILD_VARIANTS from "./get-patch-build-variants.graphql";
import GET_PATCH_TASK_STATUSES from "./get-patch-task-statuses.graphql";
import GET_PATCH_TASKS from "./get-patch-tasks.graphql";
import GET_PROJECTS from "./get-projects.graphql";
import GET_MY_PUBLIC_KEYS from "./get-public-keys.graphql";
import GET_SPRUCE_CONFIG from "./get-spruce-config.graphql";
import GET_TASK_ALL_EXECUTIONS from "./get-task-all-executions.graphql";
import GET_TASK_FILES from "./get-task-files.graphql";
import GET_TASK_TESTS from "./get-task-tests.graphql";
import GET_TASK from "./get-task.graphql";
import GET_USER_CONFIG from "./get-user-config.graphql";
import GET_USER_SETTINGS from "./get-user-settings.graphql";
import HOSTS from "./hosts.graphql";
import GET_SPAWN_EXPIRATION_INFO from "./spawn-expiration.graphql";
import GET_SPAWN_TASK from "./spawn-task.graphql";
import GET_SUBNET_AVAILABILITY_ZONES from "./subnet-availability-zones.graphql";
import TASK_QUEUE_DISTROS from "./task-queue-distros.graphql";

export { GET_USER_PATCHES } from "./user-patches";

export { GET_PROJECT_PATCHES } from "./project-patches";

export { GET_PATCH, GET_PATCH_CONFIGURE } from "./patch";
export {
  GET_EVENT_LOGS,
  GET_TASK_LOGS,
  GET_AGENT_LOGS,
  GET_SYSTEM_LOGS,
} from "./get-task-logs";
export { GET_USER, GET_OTHER_USER } from "./get-user";

export {
  TASK_QUEUE_DISTROS,
  GET_AWS_REGIONS,
  DISTRO_TASK_QUEUE,
  GET_BUILD_BARON,
  GET_CLIENT_CONFIG,
  GET_COMMIT_QUEUE,
  GET_MY_HOSTS,
  GET_PATCH_BUILD_VARIANTS,
  GET_PATCH_TASKS,
  GET_PROJECTS,
  GET_TASK_FILES,
  GET_TASK_TESTS,
  GET_TASK,
  GET_TASK_ALL_EXECUTIONS,
  GET_PATCH_TASK_STATUSES,
  GET_USER_CONFIG,
  HOSTS,
  GET_HOST,
  GET_HOST_EVENTS,
  GET_MY_PUBLIC_KEYS,
  GET_DISTROS,
  GET_MY_VOLUMES,
  GET_INSTANCE_TYPES,
  GET_SPRUCE_CONFIG,
  GET_SPAWN_EXPIRATION_INFO,
  GET_SPAWN_TASK,
  GET_SUBNET_AVAILABILITY_ZONES,
  GET_CREATED_TICKETS,
  GET_USER_SETTINGS,
  GET_CODE_CHANGES,
};
