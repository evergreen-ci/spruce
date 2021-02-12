import ABORT_TASK from "./abort-task.graphql";
import ADD_ANNOTATION from "./add-annotation.graphql";
import ATTACH_VOLUME from "./attach-volume.graphql";
import CLEAR_MY_SUBSCRIPTIONS from "./clear-my-subscriptions.graphql";
import CREATE_PUBLIC_KEY from "./create-public-key.graphql";
import DETACH_VOLUME from "./detach-volume.graphql";
import EDIT_ANNOTATION_NOTE from "./edit-annotation-note.graphql";
import EDIT_SPAWN_HOST from "./edit-spawn-host.graphql";
import ENQUEUE_PATCH from "./enqueue-patch.graphql";
import FILE_JIRA_TICKET from "./file-jira-ticket.graphql";
import MOVE_ANNOTATION from "./move-annotation.graphql";
import REMOVE_ANNOTATION from "./remove-annotation.graphql";
import REMOVE_ITEM_FROM_COMMIT_QUEUE from "./remove-item-from-commit-queue.graphql";
import REMOVE_PUBLIC_KEY from "./remove-public-key.graphql";
import REMOVE_VOLUME from "./remove-volume.graphql";
import RESTART_JASPER from "./restart-jasper.graphql";
import RESTART_PATCH from "./restart-patch.graphql";
import RESTART_TASK from "./restart-task.graphql";
import SAVE_SUBSCRIPTION from "./save-subscription.graphql";
import SCHEDULE_PATCH_TASKS from "./schedule-patch-tasks.graphql";
import SCHEDULE_PATCH from "./schedule-patch.graphql";
import SCHEDULE_TASK from "./schedule-task.graphql";
import SET_PATCH_PRIORITY from "./set-patch-priority.graphql";
import SET_TASK_PRIORTY from "./set-task-priority.graphql";
import SPAWN_HOST from "./spawn-host.graphql";
import SPAWN_VOLUME from "./spawn-volume.graphql";
import UNSCHEDULE_PATCH_TASKS from "./unschedule-patch-tasks.graphql";
import UNSCHEDULE_TASK from "./unschedule-task.graphql";
import UPDATE_HOST_STATUS from "./update-host-status.graphql";
import UPDATE_PUBLIC_KEY from "./update-public-key.graphql";
import UPDATE_SPAWN_HOST_STATUS from "./update-spawn-host-status.graphql";
import UPDATE_SPAWN_VOLUME from "./update-spawn-volume.graphql";
import UPDATE_USER_SETTINGS from "./update-user-settings.graphql";

export {
  ABORT_TASK,
  CLEAR_MY_SUBSCRIPTIONS,
  DETACH_VOLUME,
  EDIT_ANNOTATION_NOTE,
  EDIT_SPAWN_HOST,
  ENQUEUE_PATCH,
  FILE_JIRA_TICKET,
  REMOVE_ITEM_FROM_COMMIT_QUEUE,
  REMOVE_PUBLIC_KEY,
  REMOVE_VOLUME,
  RESTART_JASPER,
  RESTART_PATCH,
  RESTART_TASK,
  SCHEDULE_PATCH_TASKS,
  SCHEDULE_PATCH,
  SCHEDULE_TASK,
  SET_PATCH_PRIORITY,
  SET_TASK_PRIORTY,
  SPAWN_HOST,
  UNSCHEDULE_PATCH_TASKS,
  UNSCHEDULE_TASK,
  UPDATE_USER_SETTINGS,
  UPDATE_HOST_STATUS,
  UPDATE_SPAWN_HOST_STATUS,
  UPDATE_SPAWN_VOLUME,
  MOVE_ANNOTATION,
  REMOVE_ANNOTATION,
  ADD_ANNOTATION,
  ATTACH_VOLUME,
  CREATE_PUBLIC_KEY,
  SAVE_SUBSCRIPTION,
  SPAWN_VOLUME,
  UPDATE_PUBLIC_KEY,
};
